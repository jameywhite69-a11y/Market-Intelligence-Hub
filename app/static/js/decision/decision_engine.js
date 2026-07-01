(function(){
const KEY="tios.currentDecision.v46";
function clamp(v){return Math.max(0,Math.min(100,Number(v||0)));}
function grade(s){return s>=90?"A+":s>=80?"A":s>=70?"B":s>=60?"C":"D";}
function scoreOpportunity(o={}){
 const base=clamp(o.score||0), r=Number(o.expectedR||0);
 const s={
  trend:clamp(base+8), momentum:clamp(base+4), structure:clamp(base-2),
  risk:clamp(r>=2?90:r>=1?78:55), portfolioFit:82,
  execution:clamp(base>=80?92:72), catalyst:80
 };
 s.overall=Math.round((s.trend*.18+s.momentum*.16+s.structure*.14+s.risk*.18+s.portfolioFit*.14+s.execution*.12+s.catalyst*.08)*10)/10;
 s.grade=grade(s.overall);
 return s;
}
function recommendation(s){return s.overall>=90?"Execution Ready":s.overall>=80?"Qualified":s.overall>=70?"Review":"Wait";}
function narrative(o,s){
 if(!o)return"No opportunity selected.";
 const sym=o.symbol||"UNKNOWN", tf=o.timeframe||"15m";
 if(s.overall>=90)return `${sym} ${tf} qualifies as an institutional-grade setup. Trend, momentum, risk, and execution readiness are aligned.`;
 if(s.overall>=80)return `${sym} ${tf} is qualified but not elite. Confirm risk, portfolio exposure, and catalyst context before execution.`;
 if(s.overall>=70)return `${sym} ${tf} requires review. Opportunity quality is present, but confirmation is not strong enough for automatic execution.`;
 return `${sym} ${tf} does not meet TIOS decision standards. Wait for stronger alignment.`;
}
function buildDecision(o,source="decision-engine"){
 if(!o)return null;
 const s=scoreOpportunity(o);
 const d={id:`${o.symbol}:${o.timeframe}:${Date.now()}`,symbol:o.symbol,timeframe:o.timeframe,strategy:o.strategy||"Unassigned",source,
 recommendation:recommendation(s),institutionalScore:s,confidence:s.overall,grade:s.grade,narrative:narrative(o,s),createdAt:new Date().toISOString(),opportunity:o};
 localStorage.setItem(KEY,JSON.stringify(d));
 window.WorkspaceStore?.set?.("currentDecision",d);
 window.EventBus?.publish?.("decision.created",{decision:d});
 window.EventBus?.publish?.("decision.updated",{decision:d});
 return d;
}
function current(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;}}
function clear(){localStorage.removeItem(KEY);window.WorkspaceStore?.set?.("currentDecision",null);window.EventBus?.publish?.("decision.cleared",{});}
window.EventBus?.subscribe?.("unified-opportunity.changed",p=>buildDecision(p?.opportunity,"unified-opportunity.changed"));
document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{const o=window.UnifiedOpportunityStore?.get?.(); if(o)buildDecision(o,"startup");},900));
window.DecisionEngine={buildDecision,scoreOpportunity,current,clear};
})();
