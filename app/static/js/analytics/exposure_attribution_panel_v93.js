/*
Version 93.0 — Exposure Attribution Panel
*/
(function(){
const VERSION="93.0";
function render(model){
    const panel=document.getElementById("exposureAttributionPanelV93");
    if(!panel)return;
    const m=model||window.PortfolioAttributionEngineV93?.build?.()||{buckets:{}};
    const rows=Object.entries(m.buckets||{});
    panel.innerHTML=`<section class="v93-card"><div class="v93-header"><div><h2>Exposure Attribution</h2><span>portfolio notional by asset group</span></div><strong>${rows.length}</strong></div><div class="v93-list">${rows.map(([k,v])=>`<div><b>${k}</b><span>$${Number(v.notional||0).toFixed(2)} · ${v.count} pos.</span><em>$${Number(v.unrealized||0).toFixed(2)}</em></div>`).join("")||"<div class='v93-empty'>No open exposure yet.</div>"}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("portfolio-attribution-v93.updated",render);setTimeout(()=>render(),2000);}
window.ExposureAttributionPanelV93={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
