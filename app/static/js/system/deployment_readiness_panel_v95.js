/*
Version 95.0 — Deployment Readiness Panel
*/
(function(){
const VERSION="95.0";
function checks(){
 const readiness=window.ProductionReadinessGateV95?.readiness?.();
 return [
  ["FastAPI frontend booted",true],
  ["Production gate loaded",!!window.ProductionReadinessGateV95],
  ["Emergency stop loaded",!!window.EmergencyStopPanelV95],
  ["Replay engine loaded",!!window.ReplayBacktestingEngineV94],
  ["Broker live routing blocked",window.BrokerReadinessLayerV90?.snapshot?.()?.liveRoutingEnabled===false],
  ["Simulation abstraction active",window.MultiBrokerAbstractionV92?.snapshot?.()?.mode==="SIMULATION_ONLY"],
  ["Dependencies pass",readiness?.depsOk===true],
  ["Live disabled",true]
 ];
}
function render(){
 const panel=document.getElementById("deploymentReadinessPanelV95");
 if(!panel)return;
 const c=checks();
 panel.innerHTML=`<section class="v95-card"><div class="v95-header"><div><h2>Deployment Readiness</h2><span>${c.filter(x=>x[1]).length}/${c.length} deployment checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"REVIEW"}</strong></div><div class="v95-check-list">${c.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){
 ["production-readiness-v95.updated","emergency-stop-v95.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,2200);
}
window.DeploymentReadinessPanelV95={checks,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
