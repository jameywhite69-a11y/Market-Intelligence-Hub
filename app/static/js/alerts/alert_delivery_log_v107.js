(function(){
const VERSION="107.0";
function render(payload){
 const el=document.getElementById("alertDeliveryLogPanelV107"); if(!el)return;
 const s=payload?.state||window.InstitutionalAlertCenterV107?.snapshot?.()||{alerts:[]};
 const rows=(s.alerts||[]).slice(0,12);
 el.innerHTML=`<section class="v107-card"><div class="v107-header"><div><h2>Alert Delivery Log</h2><span>latest alert events and acknowledgements</span></div><strong>${rows.length}</strong></div><div class="v107-list">${rows.map(a=>`<div class="${a.ack?"ack":""}"><b>${a.time}</b><span>${a.title}: ${a.message}</span><em>${a.ack?"ack":"new"}</em></div>`).join("")||"<div class='v107-empty'>No alerts yet.</div>"}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-alert-center-v107.updated",render);setTimeout(()=>render(),1900);}
window.AlertDeliveryLogV107={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
