/*
Version 96.0 — Workstation Release Summary
*/
(function(){
const VERSION="96.0";
function collect(){
 const modules=[
  ["Market Stream",!!window.StreamingMarketDataBusV85],
  ["Charts",!!window.InstitutionalChartWorkspaceV87],
  ["OMS",!!window.OrderManagementSystemV88],
  ["Integration",!!window.InstitutionalIntegrationBusV89],
  ["Broker Guard",!!window.BrokerReadinessLayerV90],
  ["Execution Sim",!!window.ExecutionSimulatorV91],
  ["Broker Abstraction",!!window.MultiBrokerAbstractionV92],
  ["Portfolio Analytics",!!window.PortfolioAttributionEngineV93],
  ["Replay",!!window.ReplayBacktestingEngineV94],
  ["Production Gate",!!window.ProductionReadinessGateV95]
 ];
 return {version:VERSION,modules,ready:modules.filter(x=>x[1]).length,total:modules.length};
}
function render(){
 const panel=document.getElementById("workstationReleaseSummaryPanelV96");
 if(!panel)return;
 const c=collect();
 panel.innerHTML=`<section class="v96-card"><div class="v96-header"><div><h2>Workstation Release Summary</h2><span>V85–V96 platform maturity checkpoint</span></div><strong>${c.ready}/${c.total}</strong></div><div class="v96-grid"><div><small>Release</small><b>V96</b></div><div><small>Ready Modules</small><b>${c.ready}</b></div><div><small>Total Modules</small><b>${c.total}</b></div><div><small>Mode</small><b>Paper / Sim</b></div></div><div class="v96-list">${c.modules.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span><em>${ok?"ready":"waiting"}</em></div>`).join("")}</div></section>`;
}
function wire(){setTimeout(render,2200);}
window.WorkstationReleaseSummaryV96={collect,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
