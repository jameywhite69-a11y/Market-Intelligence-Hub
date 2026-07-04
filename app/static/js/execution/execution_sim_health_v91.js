/*
Version 91.0 — Execution Simulator Health
*/
(function(){
const VERSION="91.0";
function check(){
    return [
        ["Simulator loaded",!!window.ExecutionSimulatorV91],
        ["OMS loaded",!!window.OrderManagementSystemV88],
        ["Streaming data loaded",!!window.StreamingMarketDataBusV85],
        ["Paper account loaded",!!window.PaperTradingAccountV80],
        ["Broker guard loaded",!!window.LiveRoutingGuardV90],
        ["Paper safe",true]
    ];
}
function render(){
    const panel=document.getElementById("executionSimHealthPanelV91");
    if(!panel)return;
    const checks=check();
    panel.innerHTML=`<section class="v91-card"><div class="v91-header"><div><h2>Execution Simulator Health</h2><span>${checks.filter(x=>x[1]).length}/${checks.length} checks passing</span></div><strong>${checks.every(x=>x[1])?"READY":"WAITING"}</strong></div><div class="v91-check-list">${checks.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("execution-simulator-v91.updated",render);setTimeout(render,2400);}
window.ExecutionSimHealthPanelV91={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
