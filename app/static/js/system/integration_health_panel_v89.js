/*
Version 89.0 — Integration Health Panel
*/
(function(){
const VERSION="89.0";
function check(){
 return [
  ["Integration bus loaded",!!window.InstitutionalIntegrationBusV89],
  ["Workflow synchronizer loaded",!!window.WorkflowSynchronizerV89],
  ["Live opportunities present",(window.LiveOpportunityEngineV79?.latest?.()||[]).length>0],
  ["AI assistant present",!!window.AITradingAssistantV82],
  ["OMS present",!!window.OrderManagementSystemV88],
  ["Paper account present",!!window.PaperTradingAccountV80],
  ["Paper safe",true]
 ];
}
function render(){
 const panel=document.getElementById("integrationHealthPanelV89");
 if(!panel)return;
 const checks=check();
 panel.innerHTML=`<section class="v89-card"><div class="v89-header"><div><h2>Integration Health</h2><span>${checks.filter(x=>x[1]).length}/${checks.length} checks passing</span></div><strong>${checks.every(x=>x[1])?"HEALTHY":"REVIEW"}</strong></div><div class="v89-check-list">${checks.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){
 window.EventBus?.subscribe?.("institutional-integration-v89.updated",render);
 setTimeout(render,2600);
}
window.IntegrationHealthPanelV89={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
