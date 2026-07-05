(function(){
const VERSION="111.0";
function render(result){
 const el=document.getElementById("governanceViolationPanelV111");
 if(!el)return;
 const r=result||window.RiskGovernanceEngineV111?.evaluate?.()||{violations:[]};
 el.innerHTML=`<section class="v111-card"><div class="v111-header"><div><h2>Governance Violations</h2><span>active policy exceptions</span></div><strong>${r.violations.length}</strong></div><div class="v111-list">${r.violations.map(v=>`<div><b>${v.type}</b><span>${v.message}</span><em>BLOCK</em></div>`).join("")||"<div class='v111-empty'>No active governance violations.</div>"}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("risk-governance-v111.evaluated",render);setTimeout(()=>render(),1700);}
window.GovernanceViolationPanelV111={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
