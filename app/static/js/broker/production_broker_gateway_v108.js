(function(){
const VERSION="108.0";
const KEY="mih.tios.production.broker.gateway.v108";

const DEFAULT_STATE={
 mode:"PAPER_GATEWAY",
 liveEnabled:false,
 selected:"paper",
 brokers:[
  {id:"paper",name:"Paper Gateway",enabled:true,connected:true,live:false,status:"ready"},
  {id:"ibkr",name:"Interactive Brokers",enabled:false,connected:false,live:true,status:"not-configured"},
  {id:"coinbase",name:"Coinbase Advanced",enabled:false,connected:false,live:true,status:"not-configured"},
  {id:"tradestation",name:"TradeStation",enabled:false,connected:false,live:true,status:"not-configured"},
  {id:"alpaca",name:"Alpaca",enabled:false,connected:false,live:true,status:"not-configured"}
 ],
 audit:[]
};

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function log(s,msg,data){s.audit.unshift({time:new Date().toLocaleTimeString(),message:msg,data:data||{}});s.audit=s.audit.slice(0,150);}

function readiness(){
 const gate=window.ProductionReadinessGateV95?.readiness?.();
 const guard=window.LiveRoutingGuardV90?.check?.()||[];
 const abstraction=window.MultiBrokerAbstractionV92?.snapshot?.()||{};
 return {
  productionGateEligible:!!gate?.eligible,
  liveRoutingBlocked:abstraction.liveRoutingEnabled===false,
  guardChecks:guard,
  paperSafe:true
 };
}

function selectBroker(id){
 const s=load();
 const b=s.brokers.find(x=>x.id===id);
 if(!b)return null;
 s.selected=id;
 s.liveEnabled=false;
 s.mode="PAPER_GATEWAY";
 log(s,`${b.name} selected; live routing remains disabled`,b);
 return save(s);
}

function connectionTest(id){
 const s=load();
 const b=s.brokers.find(x=>x.id===(id||s.selected));
 if(!b)return null;
 const result={
  broker:b.id,
  ok:b.id==="paper",
  mode:"simulation-test",
  message:b.id==="paper"?"Paper gateway connection ready":"Live broker credentials not configured; simulation test only.",
  timestamp:new Date().toISOString()
 };
 b.connected=result.ok;
 b.status=result.ok?"ready":"credentials-required";
 log(s,`Connection test: ${b.name}`,result);
 save(s);
 window.EventBus?.publish?.("production-broker-gateway-v108.connection-test",result);
 return result;
}

function routeOrder(order){
 const s=load();
 const r=readiness();
 if(s.selected!=="paper" || s.liveEnabled!==true){
  log(s,"Order routed to paper/simulation gateway only",{order,readiness:r});
  const fill=window.ExecutionSimulatorV91?.simulate?.(order);
  window.EventBus?.publish?.("production-broker-gateway-v108.paper-route",{order,fill});
  save(s);
  return {status:"PAPER_ROUTED",fill,readiness:r};
 }
 log(s,"Live routing blocked by V108 safety policy",{order,readiness:r});
 save(s);
 return {status:"BLOCKED",reason:"Live routing remains disabled by production gateway.",readiness:r};
}

function routeLatest(){
 const order=window.OrderManagementSystemV88?.snapshot?.()?.orders?.[0]||null;
 return routeOrder(order);
}

function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("production-broker-gateway-v108.updated",{version:VERSION,state:snapshot(),readiness:readiness()});}

function render(){
 const el=document.getElementById("productionBrokerGatewayPanelV108");
 if(!el)return;
 const s=snapshot(), r=readiness(), selected=s.brokers.find(b=>b.id===s.selected)||s.brokers[0];
 el.innerHTML=`<section class="v108-card"><div class="v108-header"><div><h2>Production Broker Gateway</h2><span>IBKR · Coinbase · TradeStation · Alpaca · Paper Gateway</span></div><strong>${s.mode}</strong></div><div class="v108-grid"><div><small>Selected</small><b>${selected.name}</b></div><div><small>Live</small><b>${s.liveEnabled?"ON":"OFF"}</b></div><div><small>Gate</small><b>${r.productionGateEligible?"ELIGIBLE":"LOCKED"}</b></div><div><small>Paper Safe</small><b>YES</b></div></div><div class="v108-actions">${s.brokers.map(b=>`<button data-broker="${b.id}" class="${b.id===s.selected?"active":""}">${b.name}</button>`).join("")}<button id="v108Test">Connection Test</button><button id="v108Route">Route Latest Paper</button></div></section>`;
 el.querySelectorAll("[data-broker]").forEach(btn=>btn.addEventListener("click",()=>selectBroker(btn.dataset.broker)));
 document.getElementById("v108Test")?.addEventListener("click",()=>connectionTest());
 document.getElementById("v108Route")?.addEventListener("click",routeLatest);
}

function wire(){setTimeout(render,1500);}
window.ProductionBrokerGatewayV108={readiness,selectBroker,connectionTest,routeOrder,routeLatest,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
