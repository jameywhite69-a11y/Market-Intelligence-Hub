(function(){
const KEY="tios.institutional.score.v47";
function clamp(v){return Math.max(0,Math.min(100,Number(v||0)));}
function grade(s){return s>=94?"A++":s>=90?"A+":s>=84?"A":s>=76?"B":s>=68?"C":"D";}
function state(s){return s>=90?"EXECUTE":s>=82?"QUALIFIED":s>=74?"WATCH":s>=65?"SPECULATIVE":"REJECT";}
function calculate(decision){
 if(!decision)return null;
 const base=clamp(decision.confidence||decision.institutionalScore?.overall||0), src=decision.institutionalScore||{};
 const components={
  trend:clamp(src.trend||base+4), momentum:clamp(src.momentum||base+2), structure:clamp(src.structure||base-2),
  liquidity:clamp(base>=80?88:72), volatility:clamp(base>=80?84:70), portfolioFit:clamp(src.portfolioFit||82),
  riskQuality:clamp(src.risk||76), executionQuality:clamp(src.execution||84), catalyst:clamp(src.catalyst||78)
 };
 const weights={trend:.18,momentum:.14,structure:.13,liquidity:.10,volatility:.09,portfolioFit:.12,riskQuality:.12,executionQuality:.08,catalyst:.04};
 const overall=Object.entries(weights).reduce((s,[k,w])=>s+components[k]*w,0);
 const result={symbol:decision.symbol,timeframe:decision.timeframe,strategy:decision.strategy,components,weights,overall:Math.round(overall*10)/10,grade:grade(overall),institutionalState:state(overall),recommendation:state(overall),createdAt:new Date().toISOString(),decision};
 localStorage.setItem(KEY,JSON.stringify(result));
 window.WorkspaceStore?.set?.("institutionalScore",result);
 window.EventBus?.publish?.("institutional-score.updated",{score:result});
 return result;
}
function current(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;}}
window.EventBus?.subscribe?.("decision.updated",p=>calculate(p?.decision));
document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>calculate(window.DecisionEngine?.current?.()),1200));
window.InstitutionalScoringEngine={calculate,current};
})();
