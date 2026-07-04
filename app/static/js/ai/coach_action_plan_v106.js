(function(){
const VERSION="106.0";

function plan(){
 const analytics=window.InstitutionalAnalyticsEngineV105?.calc?.()||{};
 const actions=[];
 if(Number(analytics.tradeCount||0)<20) actions.push("Collect at least 20 paper trades before changing strategy assumptions.");
 if(Number(analytics.profitFactor||0)<1.25) actions.push("Review all losing trades and classify avoidable vs acceptable losses.");
 if(Number(analytics.maxDrawdown||0)<-500) actions.push("Cut risk per trade by 25–50% until drawdown stabilizes.");
 if(Number(analytics.kelly||0)>0.2) actions.push("Use fractional Kelly only; cap position sizing conservatively.");
 if(!actions.length) actions.push("Maintain current process and continue tracking execution quality.");
 return actions;
}

function render(){
 const el=document.getElementById("coachActionPlanPanelV106");
 if(!el)return;
 const rows=plan();
 el.innerHTML=`<section class="v106-card"><div class="v106-header"><div><h2>Coach Action Plan</h2><span>next steps for disciplined improvement</span></div><strong>${rows.length}</strong></div><div class="v106-list">${rows.map((r,i)=>`<div><b>Step ${i+1}</b><span>${r}</span></div>`).join("")}</div></section>`;
}

function wire(){
 window.EventBus?.subscribe?.("institutional-analytics-v105.updated",render);
 setTimeout(render,2000);
}

window.CoachActionPlanV106={plan,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
