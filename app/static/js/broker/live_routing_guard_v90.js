/*
Version 90.0 — Live Routing Guard
*/
(function(){
const VERSION="90.0";
function check(){
    const broker=window.BrokerReadinessLayerV90?.snapshot?.()||{};
    const oms=window.OrderManagementSystemV88?.snapshot?.()||{orders:[]};
    return [
        ["Broker readiness loaded",!!window.BrokerReadinessLayerV90],
        ["OMS loaded",!!window.OrderManagementSystemV88],
        ["Paper account loaded",!!window.PaperTradingAccountV80],
        ["Live routing disabled",broker.liveRoutingEnabled===false],
        ["Mode is paper-only",broker.mode==="PAPER_ONLY"],
        ["Orders remain auditable",(oms.orders||[]).every(o=>o.paperOnly!==false)]
    ];
}
function render(){
    const panel=document.getElementById("liveRoutingGuardPanelV90");
    if(!panel)return;
    const checks=check();
    panel.innerHTML=`<section class="v90-card"><div class="v90-header"><div><h2>Live Routing Guard</h2><span>${checks.filter(x=>x[1]).length}/${checks.length} safety checks passing</span></div><strong>${checks.every(x=>x[1])?"LOCKED":"REVIEW"}</strong></div><div class="v90-check-list">${checks.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){
    window.EventBus?.subscribe?.("broker-readiness-v90.updated",render);
    window.EventBus?.subscribe?.("oms-v88.updated",render);
    setTimeout(render,2200);
}
window.LiveRoutingGuardV90={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
