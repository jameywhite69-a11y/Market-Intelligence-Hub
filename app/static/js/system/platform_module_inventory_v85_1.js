(function(){
const VERSION="85.1";
const INVENTORY=[
["core","Core framework, event bus, state, dispatcher, registry"],
["system","Release checks, production polish, health monitors"],
["workspace","Layouts, docking, persistence, profiles"],
["market","Quotes, candles, streaming, adapters, market context"],
["scanner","Scanner engines, opportunity ranking, live opportunities"],
["charts","Future chart workspace and overlays"],
["ai","AI commander, assistant, narratives, coaching"],
["paper","Paper account, orders, positions, journal, sessions"],
["execution","Execution workflow and OMS"],
["broker","Broker adapters and live execution gateways"],
["portfolio","Exposure, correlation, P/L, portfolio intelligence"],
["risk","Sizing, risk budgets, rule compliance"],
["analytics","Performance analytics and reporting"],
["automation","Workflow automation and alert rules"],
["shared","Shared helpers and utilities"]
];
function snapshot(){return{version:VERSION,inventory:INVENTORY.map(x=>({group:x[0],owner:x[1]}))};}
function render(){
 const panel=document.getElementById("platformModuleInventoryPanelV85_1");
 if(!panel)return;
 panel.innerHTML=`<section class="v851-card"><div class="v851-header"><div><h2>Platform Module Inventory</h2><span>canonical subsystem ownership</span></div><strong>${INVENTORY.length}</strong></div><div class="v851-list">${INVENTORY.map(x=>`<div><b>${x[0]}/</b><span>${x[1]}</span></div>`).join("")}</div></section>`;
}
window.PlatformModuleInventoryV851={snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1200));
})();
