/*
Version 90.1 — Broker Adapter Readiness Layer Hotfix
Fix:
- Removes recursive render -> auditOrder -> save -> publish -> render loop.
- auditOrder no longer persists unless explicitly requested.
- render performs read-only audit preview.
*/
(function(){
const VERSION="90.1";
const KEY="mih.tios.broker.readiness.v90";

const DEFAULT_STATE={
    mode:"PAPER_ONLY",
    selectedBroker:"paper",
    liveRoutingEnabled:false,
    adapters:[
        {id:"paper",name:"Paper Trading",enabled:true,live:false,status:"ready"},
        {id:"alpaca",name:"Alpaca",enabled:false,live:true,status:"planned"},
        {id:"coinbase",name:"Coinbase",enabled:false,live:true,status:"planned"},
        {id:"ibkr",name:"Interactive Brokers",enabled:false,live:true,status:"planned"},
        {id:"tradier",name:"Tradier",enabled:false,live:true,status:"planned"},
        {id:"tradestation",name:"TradeStation",enabled:false,live:true,status:"planned"}
    ],
    audit:[]
};

let rendering=false;
let publishing=false;

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(state,options){
    localStorage.setItem(KEY,JSON.stringify(state));
    if(!options?.silent) publish();
    if(!options?.skipRender) render();
    return state;
}
function log(state,message,data){
    state.audit.unshift({time:new Date().toLocaleTimeString(),message,data:data||{}});
    state.audit=state.audit.slice(0,100);
}
function setBroker(id){
    const state=load();
    const adapter=state.adapters.find(a=>a.id===id);
    if(!adapter)return null;
    state.selectedBroker=id;
    state.liveRoutingEnabled=false;
    state.mode="PAPER_ONLY";
    log(state,adapter.live?`Selected ${adapter.name}; live routing remains blocked`:`Selected ${adapter.name}`,adapter);
    return save(state);
}
function latestOrder(){
    return window.OrderManagementSystemV88?.snapshot?.()?.orders?.[0]||null;
}
function buildAudit(order,state){
    const checks=[
        ["Order exists",!!order],
        ["Paper mode active",state.mode==="PAPER_ONLY"],
        ["Live routing disabled",state.liveRoutingEnabled===false],
        ["Symbol present",!!order?.symbol && order.symbol!=="—"],
        ["Quantity positive",Number(order?.qty||0)>0],
        ["Entry positive",Number(order?.entry||0)>0],
        ["Stop present",Number(order?.stop||0)>0],
        ["Paper-only flag",order?.paperOnly!==false]
    ];
    return {version:VERSION,approved:checks.every(x=>x[1]),checks,mode:state.mode,selectedBroker:state.selectedBroker};
}
function auditOrder(order,options){
    const state=load();
    const result=buildAudit(order,state);
    if(options?.persist){
        log(state,result.approved?"Broker readiness audit passed":"Broker readiness audit blocked",{order,checks:result.checks});
        save(state,{skipRender:!!options?.skipRender});
    }
    return result;
}
function snapshot(){return load();}
function publish(){
    if(publishing)return;
    publishing=true;
    try{window.EventBus?.publish?.("broker-readiness-v90.updated",{version:VERSION,state:snapshot()});}
    finally{publishing=false;}
}
function render(){
    if(rendering)return;
    rendering=true;
    try{
        const panel=document.getElementById("brokerReadinessLayerPanelV90");
        if(!panel)return;
        const s=snapshot();
        const adapter=s.adapters.find(a=>a.id===s.selectedBroker)||s.adapters[0];
        const preview=latestOrder()?buildAudit(latestOrder(),s):null;
        panel.innerHTML=`<section class="v90-card ${String(s.mode).toLowerCase()}"><div class="v90-header"><div><h2>Broker Adapter Readiness Layer</h2><span>paper-safe broker abstraction guardrail</span></div><strong>${s.mode}</strong></div><div class="v90-grid"><div><small>Selected</small><b>${adapter.name}</b></div><div><small>Live Routing</small><b>${s.liveRoutingEnabled?"ON":"BLOCKED"}</b></div><div><small>Adapters</small><b>${s.adapters.length}</b></div><div><small>Audit</small><b>${preview?preview.approved?"PASS":"BLOCK":"WAIT"}</b></div></div><div class="v90-actions">${s.adapters.map(a=>`<button data-broker="${a.id}" class="${a.id===s.selectedBroker?"active":""}">${a.name}</button>`).join("")}</div><div class="v90-note"><b>Safety</b><span>V90.1 keeps all order flow paper-only and prevents recursive audit publishing.</span></div></section>`;
        panel.querySelectorAll("[data-broker]").forEach(btn=>btn.addEventListener("click",()=>setBroker(btn.dataset.broker)));
    } finally {
        rendering=false;
    }
}
function wire(){
    window.EventBus?.subscribe?.("oms-v88.updated",()=>render());
    setTimeout(render,1800);
}
window.BrokerReadinessLayerV90={setBroker,auditOrder,latestOrder,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
