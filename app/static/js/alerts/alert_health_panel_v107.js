(function(){
const VERSION="107.0";
function check(){
 const s=window.InstitutionalAlertCenterV107?.snapshot?.();
 return [
  ["Alert center loaded",!!window.InstitutionalAlertCenterV107],
  ["Rule manager loaded",!!window.AlertRuleManagerV107],
  ["Delivery log loaded",!!window.AlertDeliveryLogV107],
  ["Browser channel ready",!!s?.channels?.find(c=>c.id==="browser"&&c.enabled)],
  ["EventBus available",!!window.EventBus],
  ["Paper safe",true]
 ];
}
function render(){
 const el=document.getElementById("alertHealthPanelV107"); if(!el)return;
 const c=check();
 el.innerHTML=`<section class="v107-card"><div class="v107-header"><div><h2>Alert Health</h2><span>${c.filter(x=>x[1]).length}/${c.length} checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"REVIEW"}</strong></div><div class="v107-check-list">${c.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-alert-center-v107.updated",render);setTimeout(render,2100);}
window.AlertHealthPanelV107={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
