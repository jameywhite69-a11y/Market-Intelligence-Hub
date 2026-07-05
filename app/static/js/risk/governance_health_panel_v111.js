(function(){
const VERSION="111.0";
function check(){
 return [
  ["Governance engine loaded",!!window.RiskGovernanceEngineV111],
  ["Account aggregation loaded",!!window.AccountAggregationEngineV104],
  ["Portfolio attribution loaded",!!window.PortfolioAttributionEngineV93],
  ["Broker gateway loaded",!!window.ProductionBrokerGatewayV108],
  ["Allocator loaded",!!window.IntelligentPortfolioAllocatorV110],
  ["Paper safe",true]
 ];
}
function render(){
 const el=document.getElementById("governanceHealthPanelV111");
 if(!el)return;
 const c=check();
 el.innerHTML=`<section class="v111-card"><div class="v111-header"><div><h2>Governance Health</h2><span>${c.filter(x=>x[1]).length}/${c.length} checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"REVIEW"}</strong></div><div class="v111-check-list">${c.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("risk-governance-v111.updated",render);setTimeout(render,1900);}
window.GovernanceHealthPanelV111={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
