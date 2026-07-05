(function(){
const VERSION="108.0";
const STEPS=["Select broker","Verify credentials placeholder","Run simulation connection test","Confirm paper-safe routing","Review production gate"];

let step=0;
function next(){if(step<STEPS.length-1){step++;render();}}
function prev(){if(step>0){step--;render();}}
function render(){
 const el=document.getElementById("brokerConnectionWizardPanelV108");
 if(!el)return;
 const state=window.ProductionBrokerGatewayV108?.snapshot?.()||{};
 el.innerHTML=`<section class="v108-card"><div class="v108-header"><div><h2>Broker Connection Wizard</h2><span>guided broker setup without live routing</span></div><strong>${step+1}/${STEPS.length}</strong></div><div class="v108-note"><b>${STEPS[step]}</b><span>Selected broker: ${state.selected||"paper"}. This wizard validates configuration only and does not enable live trading.</span></div><div class="v108-actions"><button id="v108Prev">Previous</button><button id="v108Next">Next</button></div></section>`;
 document.getElementById("v108Prev")?.addEventListener("click",prev);
 document.getElementById("v108Next")?.addEventListener("click",next);
}
function wire(){window.EventBus?.subscribe?.("production-broker-gateway-v108.updated",render);setTimeout(render,1700);}
window.BrokerConnectionWizardV108={render,next,prev,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
