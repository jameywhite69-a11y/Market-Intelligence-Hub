/*
Version 90.0 — Broker Adapter Catalog
*/
(function(){
const VERSION="90.0";
function render(payload){
    const panel=document.getElementById("brokerAdapterCatalogPanelV90");
    if(!panel)return;
    const state=payload?.state||window.BrokerReadinessLayerV90?.snapshot?.()||{adapters:[]};
    const rows=state.adapters||[];
    panel.innerHTML=`<section class="v90-card"><div class="v90-header"><div><h2>Broker Adapter Catalog</h2><span>future live gateway inventory</span></div><strong>${rows.length}</strong></div><div class="v90-list">${rows.map(a=>`<div class="${a.status}"><b>${a.name}</b><span>${a.live?"Live planned":"Paper ready"}</span><em>${a.status}</em></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("broker-readiness-v90.updated",render);setTimeout(()=>render(),2000);}
window.BrokerAdapterCatalogV90={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
