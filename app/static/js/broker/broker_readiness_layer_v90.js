/*
Version 90.0 — Broker Adapter Readiness Layer
Purpose:
- Prepares the platform for future broker adapters.
- Keeps all routing paper-safe by default.
- Audits OMS orders before any broker handoff.
*/
(function(){
const VERSION="90.0";
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

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(state){localStorage.setItem(KEY,JSON.stringify(state));publish();render();return state;}
function log(state,message,data){state.audit.unshift({time:new Date().toLocaleTimeString(),message,data:data||{}});state.audit=state.audit.slice(0,100);}

function setBroker(id){
    const state=load();
    const adapter=state.adapters.find(a=>a.id===id);
    if(!adapter)return null;
    state.selectedBroker=id;
    if(adapter.live){
        state.liveRoutingEnabled=false;
        state.mode="PAPER_ONLY";
        log(state,`Selected ${adapter.name}; live routing remains blocked`,adapter);
    }else{
        state.mode="PAPER_ONLY";
        log(state,`Selected ${adapter.name}`,adapter);
    }
    return save(state);
}

function auditOrder(order){
    const state=load();
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
    const approved=checks.every(x=>x[1]);
    log(state,approved?"Broker readiness audit passed":"Broker readiness audit blocked",{order,checks});
    save(state);
    return {version:VERSION,approved,checks,mode:state.mode,selectedBroker:state.selectedBroker};
}

function latestOrder(){
    return window.OrderManagementSystemV88?.snapshot?.()?.orders?.[0]||null;
}

function snapshot(){return load();}

function publish(){
    window.EventBus?.publish?.("broker-readiness-v90.updated",{version:VERSION,state:snapshot()});
}

function render(){
    const panel=document.getElementById("brokerReadinessLayerPanelV90");
    if(!panel)return;
    const s=snapshot();
    const adapter=s.adapters.find(a=>a.id===s.selectedBroker)||s.adapters[0];
    const audit=latestOrder()?auditOrder(latestOrder()):null;
    panel.innerHTML=`<section class="v90-card ${s.mode.toLowerCase()}"><div class="v90-header"><div><h2>Broker Adapter Readiness Layer</h2><span>paper-safe broker abstraction guardrail</span></div><strong>${s.mode}</strong></div><div class="v90-grid"><div><small>Selected</small><b>${adapter.name}</b></div><div><small>Live Routing</small><b>${s.liveRoutingEnabled?"ON":"BLOCKED"}</b></div><div><small>Adapters</small><b>${s.adapters.length}</b></div><div><small>Audit</small><b>${audit?audit.approved?"PASS":"BLOCK":"WAIT"}</b></div></div><div class="v90-actions">${s.adapters.map(a=>`<button data-broker="${a.id}" class="${a.id===s.selectedBroker?"active":""}">${a.name}</button>`).join("")}</div><div class="v90-note"><b>Safety</b><span>V90 prepares live broker architecture but keeps all order flow paper-only.</span></div></section>`;
    panel.querySelectorAll("[data-broker]").forEach(btn=>btn.addEventListener("click",()=>setBroker(btn.dataset.broker)));
}

function wire(){
    window.EventBus?.subscribe?.("oms-v88.updated",()=>render());
    setTimeout(render,1800);
}

window.BrokerReadinessLayerV90={setBroker,auditOrder,latestOrder,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
