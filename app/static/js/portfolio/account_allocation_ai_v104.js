(function(){
const VERSION="104.0";
function recommend(){const agg=window.AccountAggregationEngineV104?.aggregate?.()||{accounts:[],totals:{equity:0}};const total=Number(agg.totals.equity||1);return (agg.accounts||[]).map(a=>{const pct=total?Number(a.equity||0)/total*100:0;let action="Maintain";if(pct<20&&a.status==="connected")action="Increase allocation";if(pct>60)action="Reduce concentration";if(a.status!=="connected")action="Skip until connected";return{...a,allocationPct:pct,action};});}
function render(){const el=document.getElementById("accountAllocationAIPanelV104");if(!el)return;const rows=recommend();el.innerHTML=`<section class="v104-card"><div class="v104-header"><div><h2>Account Allocation AI</h2><span>cross-account capital allocation recommendations</span></div><strong>${rows.length}</strong></div><div class="v104-list">${rows.map(r=>`<div><b>${r.name}</b><span>${r.allocationPct.toFixed(1)}% allocation</span><em>${r.action}</em></div>`).join("")}</div></section>`;}
function wire(){window.EventBus?.subscribe?.("account-aggregation-v104.updated",render);setTimeout(render,1900);}
window.AccountAllocationAIV104={recommend,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
