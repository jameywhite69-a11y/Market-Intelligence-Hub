(function(){
const VERSION="111.0";
const KEY="mih.tios.risk.governance.v111";

const DEFAULT_STATE={
 enabled:true,
 limits:{
  maxPortfolioRiskPct:3,
  maxAccountRiskPct:2,
  maxStrategyAllocationPct:35,
  maxConcurrentPositions:8,
  maxDailyLossPct:2,
  requirePaperMode:true
 },
 violations:[],
 audit:[]
};

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function log(s,msg,data){s.audit.unshift({time:new Date().toLocaleTimeString(),message:msg,data:data||{}});s.audit=s.audit.slice(0,150);}

function snapshot(){return load();}

function evaluate(){
 const s=load();
 const allocation=window.IntelligentPortfolioAllocatorV110?.allocate?.()||[];
 const accounts=window.AccountAggregationEngineV104?.aggregate?.()||{totals:{},accounts:[]};
 const attribution=window.PortfolioAttributionEngineV93?.build?.()||{};
 const broker=window.ProductionBrokerGatewayV108?.snapshot?.()||{};
 const paper=window.PaperTradingAccountV80?.snapshot?.()||{positions:[]};

 const violations=[];
 const totalRisk=Number(accounts.totals?.riskPct||attribution.riskPct||0);
 const dailyLossPct=accounts.totals?.equity?Math.abs(Math.min(0,Number(accounts.totals.dailyPnl||0)))/Number(accounts.totals.equity||1)*100:0;
 const openPositions=(paper.positions||[]).filter(p=>p.status==="OPEN").length;

 if(totalRisk>s.limits.maxPortfolioRiskPct) violations.push({type:"portfolio-risk",message:`Portfolio risk ${totalRisk.toFixed(2)}% exceeds ${s.limits.maxPortfolioRiskPct}%`});
 if(dailyLossPct>s.limits.maxDailyLossPct) violations.push({type:"daily-loss",message:`Daily loss ${dailyLossPct.toFixed(2)}% exceeds ${s.limits.maxDailyLossPct}%`});
 if(openPositions>s.limits.maxConcurrentPositions) violations.push({type:"position-count",message:`Open positions ${openPositions} exceeds ${s.limits.maxConcurrentPositions}`});
 allocation.forEach(a=>{
  const allocPct=accounts.totals?.equity?Number(a.allocation||0)/Number(accounts.totals.equity||1)*100:0;
  if(allocPct>s.limits.maxStrategyAllocationPct) violations.push({type:"strategy-allocation",message:`${a.strategy} allocation ${allocPct.toFixed(1)}% exceeds ${s.limits.maxStrategyAllocationPct}%`});
 });
 if(s.limits.requirePaperMode && broker.liveEnabled) violations.push({type:"live-routing",message:"Live routing is enabled while paper-mode governance is required."});

 const result={
  version:VERSION,
  timestamp:new Date().toISOString(),
  status:violations.length?"BLOCK":"PASS",
  violations,
  totalRisk,
  dailyLossPct,
  openPositions,
  limits:s.limits
 };
 s.violations=violations;
 log(s,`Governance evaluation: ${result.status}`,result);
 localStorage.setItem(KEY,JSON.stringify(s));
 window.EventBus?.publish?.("risk-governance-v111.evaluated",result);
 return result;
}

function updateLimit(key,value){
 const s=load();
 if(key in s.limits){
  s.limits[key]=Number.isFinite(Number(value))?Number(value):value;
  log(s,`Limit updated: ${key}`,{value:s.limits[key]});
 }
 return save(s);
}

function publish(){window.EventBus?.publish?.("risk-governance-v111.updated",{version:VERSION,state:snapshot()});}

function render(){
 const el=document.getElementById("riskGovernanceEnginePanelV111");
 if(!el)return;
 const result=evaluate();
 el.innerHTML=`<section class="v111-card"><div class="v111-header"><div><h2>Risk Governance Engine</h2><span>portfolio risk limits · exposure policy · execution guardrails</span></div><strong>${result.status}</strong></div><div class="v111-grid"><div><small>Portfolio Risk</small><b>${result.totalRisk.toFixed(2)}%</b></div><div><small>Daily Loss</small><b>${result.dailyLossPct.toFixed(2)}%</b></div><div><small>Open Pos.</small><b>${result.openPositions}</b></div><div><small>Violations</small><b>${result.violations.length}</b></div></div></section>`;
}

function wire(){
 ["account-aggregation-v104.updated","portfolio-attribution-v93.updated","production-broker-gateway-v108.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,1500);
}

window.RiskGovernanceEngineV111={snapshot,evaluate,updateLimit,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
