(function(){
const VERSION="108.0";
function check(){
 return [
  ["Production broker gateway loaded",!!window.ProductionBrokerGatewayV108],
  ["Broker wizard loaded",!!window.BrokerConnectionWizardV108],
  ["V95 production gate loaded",!!window.ProductionReadinessGateV95],
  ["V92 abstraction loaded",!!window.MultiBrokerAbstractionV92],
  ["V91 simulator loaded",!!window.ExecutionSimulatorV91],
  ["Live routing remains disabled",window.ProductionBrokerGatewayV108?.snapshot?.()?.liveEnabled===false]
 ];
}
function render(){
 const el=document.getElementById("brokerGatewayHealthPanelV108");
 if(!el)return;
 const c=check();
 el.innerHTML=`<section class="v108-card"><div class="v108-header"><div><h2>Broker Gateway Health</h2><span>${c.filter(x=>x[1]).length}/${c.length} checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"REVIEW"}</strong></div><div class="v108-check-list">${c.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("production-broker-gateway-v108.updated",render);setTimeout(render,1900);}
window.BrokerGatewayHealthV108={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
