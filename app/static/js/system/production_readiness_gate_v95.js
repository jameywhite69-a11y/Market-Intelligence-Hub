/*
Version 95.0 — Production Readiness & Live Enablement Gate
Purpose:
- Final safety gate before any future live broker routing.
- Keeps the system paper/simulation-only by default.
- Requires explicit checks before live enablement can even be considered.
*/
(function(){
const VERSION="95.0";
const KEY="mih.tios.production.readiness.v95";

const DEFAULT_STATE={
    mode:"PAPER_SIMULATION",
    liveEligible:false,
    liveEnabled:false,
    acknowledgements:{
        paperStable:false,
        brokerConfigured:false,
        riskLimitsReviewed:false,
        emergencyStopReviewed:false,
        complianceReviewed:false
    },
    audit:[]
};

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function log(s,m,d){s.audit.unshift({time:new Date().toLocaleTimeString(),message:m,data:d||{}});s.audit=s.audit.slice(0,150);}

function dependencyChecks(){
 return [
  ["EventBus",!!window.EventBus],
  ["Streaming data",!!window.StreamingMarketDataBusV85],
  ["OMS",!!window.OrderManagementSystemV88],
  ["Broker readiness",!!window.BrokerReadinessLayerV90],
  ["Execution simulator",!!window.ExecutionSimulatorV91],
  ["Multi-broker abstraction",!!window.MultiBrokerAbstractionV92],
  ["Portfolio attribution",!!window.PortfolioAttributionEngineV93],
  ["Replay engine",!!window.ReplayBacktestingEngineV94],
  ["Live routing currently blocked",window.BrokerReadinessLayerV90?.snapshot?.()?.liveRoutingEnabled===false],
  ["Simulation broker mode",window.MultiBrokerAbstractionV92?.snapshot?.()?.mode==="SIMULATION_ONLY"]
 ];
}

function readiness(){
 const s=load();
 const deps=dependencyChecks();
 const ack=Object.values(s.acknowledgements).every(Boolean);
 const depsOk=deps.every(x=>x[1]);
 return {version:VERSION,deps,acknowledgements:s.acknowledgements,acknowledged:ack,depsOk,eligible:ack&&depsOk,liveEnabled:false,mode:s.mode};
}

function toggleAck(key){
 const s=load();
 if(!(key in s.acknowledgements))return null;
 s.acknowledgements[key]=!s.acknowledgements[key];
 const r=readiness();
 s.liveEligible=r.eligible;
 s.liveEnabled=false;
 s.mode="PAPER_SIMULATION";
 log(s,`Acknowledgement changed: ${key}`,{value:s.acknowledgements[key]});
 return save(s);
}

function lockPaperMode(){
 const s=load();
 s.liveEnabled=false;
 s.liveEligible=false;
 s.mode="PAPER_SIMULATION";
 log(s,"Paper/simulation mode locked");
 return save(s);
}

function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("production-readiness-v95.updated",{version:VERSION,state:snapshot(),readiness:readiness()});}

function render(){
 const panel=document.getElementById("productionReadinessGatePanelV95");
 if(!panel)return;
 const s=snapshot();
 const r=readiness();
 const ackRows=Object.entries(s.acknowledgements);
 panel.innerHTML=`<section class="v95-card"><div class="v95-header"><div><h2>Production Readiness Gate</h2><span>live enablement guardrail · paper/simulation locked</span></div><strong>${r.eligible?"ELIGIBLE":"LOCKED"}</strong></div><div class="v95-grid"><div><small>Mode</small><b>${s.mode}</b></div><div><small>Deps</small><b>${r.deps.filter(x=>x[1]).length}/${r.deps.length}</b></div><div><small>Ack</small><b>${ackRows.filter(x=>x[1]).length}/${ackRows.length}</b></div><div><small>Live</small><b>DISABLED</b></div></div><div class="v95-ack-list">${ackRows.map(([k,v])=>`<button data-ack="${k}" class="${v?"on":"off"}">${v?"✓":"!"} ${k}</button>`).join("")}</div><div class="v95-actions"><button id="v95LockPaper">Lock Paper Mode</button></div><div class="v95-note"><b>Safety</b><span>V95 does not enable live trading. It defines the readiness gate and keeps routing simulation-only.</span></div></section>`;
 panel.querySelectorAll("[data-ack]").forEach(btn=>btn.addEventListener("click",()=>toggleAck(btn.dataset.ack)));
 document.getElementById("v95LockPaper")?.addEventListener("click",lockPaperMode);
}

function wire(){
 ["broker-readiness-v90.updated","broker-abstraction-v92.updated","replay-backtest-v94.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,1800);
}

window.ProductionReadinessGateV95={dependencyChecks,readiness,toggleAck,lockPaperMode,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
