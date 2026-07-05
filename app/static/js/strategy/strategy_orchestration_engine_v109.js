
(function(){
const VERSION="109.0";
const registry=[];
function register(def){ if(def&&def.id){ registry.push(def); render(); } }
function evaluate(ctx){
 return registry.map(s=>({
   id:s.id,
   name:s.name||s.id,
   score: typeof s.score==="function" ? s.score(ctx||{}) : 0
 })).sort((a,b)=>b.score-a.score);
}
function render(){
 const el=document.getElementById("strategyOrchestrationPanelV109");
 if(!el) return;
 const rows=evaluate(window.InstitutionalAnalyticsEngineV105?.calc?.()||{});
 el.innerHTML=`<section class="v109-card">
 <h2>Strategy Orchestration Engine</h2>
 <table><tr><th>Strategy</th><th>Score</th></tr>
 ${rows.map(r=>`<tr><td>${r.name}</td><td>${r.score.toFixed? r.score.toFixed(1):r.score}</td></tr>`).join("")||"<tr><td colspan='2'>No registered strategies</td></tr>"}
 </table></section>`;
}
window.StrategyOrchestrationEngineV109={version:VERSION,register,evaluate,render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
