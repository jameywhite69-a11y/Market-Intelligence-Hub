(function(){
const VERSION="107.0";
function render(payload){
 const el=document.getElementById("alertRuleManagerPanelV107"); if(!el)return;
 const s=payload?.state||window.InstitutionalAlertCenterV107?.snapshot?.()||{rules:[]};
 el.innerHTML=`<section class="v107-card"><div class="v107-header"><div><h2>Alert Rule Manager</h2><span>event-driven alert rule inventory</span></div><strong>${s.rules.filter(r=>r.enabled).length}/${s.rules.length}</strong></div><div class="v107-list">${s.rules.map(r=>`<div><b>${r.name}</b><span>${r.source}</span><em>${r.enabled?"enabled":"off"}</em></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-alert-center-v107.updated",render);setTimeout(()=>render(),1700);}
window.AlertRuleManagerV107={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
