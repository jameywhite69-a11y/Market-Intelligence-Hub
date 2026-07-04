/*
Version 97.0 — Module Dependency Map
*/
(function(){
const VERSION="97.0";
const DEPENDENCIES=[
 ["Core/EventBus","All event-driven modules","Required first"],
 ["V85 Streaming","V79 Opportunities, V87 Charts, V94 Replay","Market feed"],
 ["V79 Opportunities","V82 AI, V88 OMS, V89 Integration","Signal source"],
 ["V80 Paper Account","V81 Risk, V83 Command, V88 OMS","Paper execution"],
 ["V82 AI Assistant","V88 OMS, V87 Overlay, V89 Integration","Decision context"],
 ["V88 OMS","V91 Simulator, V92 Broker Abstraction","Order state"],
 ["V91 Simulator","V93 Attribution, V94 Replay","Execution quality"],
 ["V93 Attribution","V94 Replay, V96 Summary","Performance model"],
 ["V95 Production Gate","V96 Summary","Safety gate"]
];
function render(){
 const panel=document.getElementById("moduleDependencyMapPanelV97");
 if(!panel)return;
 panel.innerHTML=`<section class="v97-card"><div class="v97-header"><div><h2>Module Dependency Map</h2><span>critical platform dependency chain</span></div><strong>${DEPENDENCIES.length}</strong></div><div class="v97-list">${DEPENDENCIES.map(([a,b,c])=>`<div><b>${a}</b><span>${b}</span><em>${c}</em></div>`).join("")}</div></section>`;
}
function wire(){setTimeout(render,2000);}
window.ModuleDependencyMapV97={dependencies:DEPENDENCIES,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
