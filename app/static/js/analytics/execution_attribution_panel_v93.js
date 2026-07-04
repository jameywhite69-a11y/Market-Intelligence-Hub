/*
Version 93.0 — Execution Attribution Panel
*/
(function(){
const VERSION="93.0";
function render(model){
    const panel=document.getElementById("executionAttributionPanelV93");
    if(!panel)return;
    const m=model||window.PortfolioAttributionEngineV93?.build?.()||{fillStats:{}};
    const f=m.fillStats||{};
    panel.innerHTML=`<section class="v93-card"><div class="v93-header"><div><h2>Execution Attribution</h2><span>simulated fill quality and friction</span></div><strong>${f.fills||0} FILLS</strong></div><div class="v93-grid"><div><small>Fills</small><b>${f.fills||0}</b></div><div><small>Partials</small><b>${f.partials||0}</b></div><div><small>Avg Latency</small><b>${Number(f.avgLatency||0).toFixed(0)} ms</b></div><div><small>Avg Slip</small><b>${Number(f.avgSlippage||0).toFixed(1)} bps</b></div><div><small>Mode</small><b>SIM</b></div><div><small>Broker</small><b>Paper</b></div></div></section>`;
}
function wire(){window.EventBus?.subscribe?.("portfolio-attribution-v93.updated",render);setTimeout(()=>render(),2200);}
window.ExecutionAttributionPanelV93={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
