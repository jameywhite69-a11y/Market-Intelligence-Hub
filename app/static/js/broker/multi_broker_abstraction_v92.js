(function(){
const VERSION="92.0",KEY="mih.tios.multi.broker.v92";
const DEFAULT_STATE={mode:"SIMULATION_ONLY",activeAdapter:"paper-sim",liveRoutingEnabled:false,adapters:[
{id:"paper-sim",name:"Paper Simulator",type:"simulation",enabled:true,connected:true,live:false,capabilities:["market","limit","stop","bracket","partial_fills"]},
{id:"alpaca",name:"Alpaca",type:"broker",enabled:false,connected:false,live:true,capabilities:["market","limit","stop","bracket"]},
{id:"coinbase",name:"Coinbase Advanced",type:"exchange",enabled:false,connected:false,live:true,capabilities:["market","limit","stop"]},
{id:"ibkr",name:"Interactive Brokers",type:"broker",enabled:false,connected:false,live:true,capabilities:["market","limit","stop","bracket","options","futures"]},
{id:"tradier",name:"Tradier",type:"broker",enabled:false,connected:false,live:true,capabilities:["market","limit","stop","options"]},
{id:"tradestation",name:"TradeStation",type:"broker",enabled:false,connected:false,live:true,capabilities:["market","limit","stop","futures"]}
],audit:[]};
function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function log(s,m,d){s.audit.unshift({time:new Date().toLocaleTimeString(),message:m,data:d||{}});s.audit=s.audit.slice(0,150);}
function adapter(id){const s=load();return s.adapters.find(a=>a.id===(id||s.activeAdapter))||s.adapters[0];}
function selectAdapter(id){const s=load(),a=s.adapters.find(x=>x.id===id);if(!a)return null;s.activeAdapter=id;s.liveRoutingEnabled=false;s.mode="SIMULATION_ONLY";log(s,`${a.name} selected; live routing remains disabled`,a);return save(s);}
function normalizeOrder(o){return{brokerOrderId:null,clientOrderId:o?.id||`CLIENT-${Date.now()}`,symbol:o?.symbol||"—",side:o?.side||"BUY",type:o?.orderType||"MARKET",qty:Number(o?.qty||0),entry:Number(o?.entry||o?.price||0),stop:Number(o?.stop||0),tp1:Number(o?.tp1||0),tp2:Number(o?.tp2||0),timeInForce:"DAY",paperOnly:true,source:"V92 Broker Abstraction"};}
function preflight(order){const s=load(),a=adapter(),n=normalizeOrder(order);const t=String(n.type).toLowerCase();const checks=[["Adapter selected",!!a],["Simulation mode",s.mode==="SIMULATION_ONLY"],["Live routing disabled",s.liveRoutingEnabled===false],["Paper-only order",n.paperOnly===true],["Symbol present",!!n.symbol&&n.symbol!=="—"],["Quantity positive",n.qty>0],["Entry positive",n.entry>0],["Adapter supports order type",(a.capabilities||[]).includes(t)||t==="market"]];return{version:VERSION,adapter:a,order:n,approved:checks.every(x=>x[1]),checks};}
function route(order){const s=load(),p=preflight(order);if(!p.approved){log(s,"Broker abstraction route blocked",p);save(s);return{status:"BLOCKED",preflight:p};}log(s,`Routed ${p.order.symbol} to simulation adapter`,p);save(s);const fill=window.ExecutionSimulatorV91?.simulate?.(order);window.EventBus?.publish?.("broker-abstraction-v92.routed",{version:VERSION,preflight:p,fill});return{status:"SIMULATED",preflight:p,fill};}
function latestOrder(){return window.OrderManagementSystemV88?.snapshot?.()?.orders?.[0]||null;}
function routeLatest(){return route(latestOrder());}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("broker-abstraction-v92.updated",{version:VERSION,state:snapshot()});}
function render(){const panel=document.getElementById("multiBrokerAbstractionPanelV92");if(!panel)return;const s=snapshot(),a=adapter(),p=latestOrder()?preflight(latestOrder()):null;panel.innerHTML=`<section class="v92-card"><div class="v92-header"><div><h2>Multi-Broker Abstraction Layer</h2><span>uniform broker interface · simulation-only routing</span></div><strong>${s.mode}</strong></div><div class="v92-grid"><div><small>Active</small><b>${a.name}</b></div><div><small>Live Routing</small><b>${s.liveRoutingEnabled?"ON":"BLOCKED"}</b></div><div><small>Adapters</small><b>${s.adapters.length}</b></div><div><small>Preflight</small><b>${p?p.approved?"PASS":"BLOCK":"WAIT"}</b></div></div><div class="v92-actions">${s.adapters.map(x=>`<button data-adapter="${x.id}" class="${x.id===s.activeAdapter?"active":""}">${x.name}</button>`).join("")}<button id="v92RouteLatest">Route Latest to Simulator</button></div></section>`;panel.querySelectorAll("[data-adapter]").forEach(btn=>btn.addEventListener("click",()=>selectAdapter(btn.dataset.adapter)));document.getElementById("v92RouteLatest")?.addEventListener("click",routeLatest);}
function wire(){window.EventBus?.subscribe?.("oms-v88.updated",render);setTimeout(render,1800);}
window.MultiBrokerAbstractionV92={selectAdapter,normalizeOrder,preflight,route,routeLatest,latestOrder,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
