/*
Version 93.0 — Performance Attribution Panel
*/
(function(){
const VERSION="93.0";
function render(model){
    const panel=document.getElementById("performanceAttributionPanelV93");
    if(!panel)return;
    const m=model||window.PortfolioAttributionEngineV93?.build?.()||{};
    panel.innerHTML=`<section class="v93-card"><div class="v93-header"><div><h2>Performance Attribution</h2><span>realized, unrealized, and execution contribution</span></div><strong>$${Number(m.totalPnl||0).toFixed(2)}</strong></div><div class="v93-grid"><div><small>Realized</small><b>$${Number(m.realized||0).toFixed(2)}</b></div><div><small>Unrealized</small><b>$${Number(m.unrealized||0).toFixed(2)}</b></div><div><small>Trades</small><b>${m.trades||0}</b></div><div><small>Wins</small><b>${m.wins||0}</b></div><div><small>Losses</small><b>${m.losses||0}</b></div><div><small>Journal</small><b>${m.journalEntries||0}</b></div></div></section>`;
}
function wire(){window.EventBus?.subscribe?.("portfolio-attribution-v93.updated",render);setTimeout(()=>render(),2100);}
window.PerformanceAttributionPanelV93={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
