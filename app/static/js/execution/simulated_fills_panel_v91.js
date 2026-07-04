/*
Version 91.0 — Simulated Fills Panel
*/
(function(){
const VERSION="91.0";
function render(payload){
    const panel=document.getElementById("simulatedFillsPanelV91");
    if(!panel)return;
    const state=payload?.state||window.ExecutionSimulatorV91?.snapshot?.()||{fills:[]};
    const rows=(state.fills||[]).slice(0,12);
    panel.innerHTML=`<section class="v91-card"><div class="v91-header"><div><h2>Simulated Fills</h2><span>execution simulator fill history</span></div><strong>${rows.length}</strong></div><div class="v91-list">${rows.map(f=>`<div class="${String(f.status).toLowerCase()}"><b>${f.symbol}</b><span>${f.status} · ${f.qty}/${f.requestedQty} @ ${Number(f.price||0).toFixed(4)}</span><em>${f.slippageBps} bps</em></div>`).join("")||"<div class='v91-empty'>No simulated fills yet.</div>"}</div></section>`;
}
function wire(){
    window.EventBus?.subscribe?.("execution-simulator-v91.updated",render);
    window.EventBus?.subscribe?.("execution-simulator-v91.fill",()=>render());
    setTimeout(()=>render(),2000);
}
window.SimulatedFillsPanelV91={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
