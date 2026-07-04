/*
Version 91.0 — Execution Quality Panel
*/
(function(){
const VERSION="91.0";
function metrics(){
    const fills=window.ExecutionSimulatorV91?.snapshot?.()?.fills||[];
    const avgSlip=fills.length?fills.reduce((a,f)=>a+Number(f.slippageBps||0),0)/fills.length:0;
    const avgLatency=fills.length?fills.reduce((a,f)=>a+Number(f.latencyMs||0),0)/fills.length:0;
    const partials=fills.filter(f=>f.status==="PARTIALLY_FILLED").length;
    return {fills:fills.length,avgSlip,avgLatency,partials,fillRate:fills.length?((fills.length-partials)/fills.length)*100:0};
}
function render(){
    const panel=document.getElementById("executionQualityPanelV91");
    if(!panel)return;
    const m=metrics();
    panel.innerHTML=`<section class="v91-card"><div class="v91-header"><div><h2>Execution Quality</h2><span>simulated execution performance</span></div><strong>${m.fillRate.toFixed(0)}%</strong></div><div class="v91-grid"><div><small>Fills</small><b>${m.fills}</b></div><div><small>Full Fill Rate</small><b>${m.fillRate.toFixed(1)}%</b></div><div><small>Partials</small><b>${m.partials}</b></div><div><small>Avg Latency</small><b>${m.avgLatency.toFixed(0)} ms</b></div><div><small>Avg Slip</small><b>${m.avgSlip.toFixed(1)} bps</b></div><div><small>Mode</small><b>PAPER</b></div></div></section>`;
}
function wire(){window.EventBus?.subscribe?.("execution-simulator-v91.updated",render);setTimeout(render,2200);}
window.ExecutionQualityPanelV91={metrics,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
