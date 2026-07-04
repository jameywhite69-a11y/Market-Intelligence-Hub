/*
Version 96.0 — Workspace Section Health
*/
(function(){
const VERSION="96.0";
function render(snapshot){
 const panel=document.getElementById("workspaceSectionHealthPanelV96");
 if(!panel)return;
 const snap=snapshot||window.WorkspaceConsolidationEngineV96?.snapshot?.()||{sections:[]};
 panel.innerHTML=`<section class="v96-card"><div class="v96-header"><div><h2>Workspace Section Health</h2><span>panel presence by workflow section</span></div><strong>${snap.sections.filter(s=>s.status.ready).length}/${snap.sections.length}</strong></div><div class="v96-list">${snap.sections.map(s=>`<div class="${s.status.ready?"pass":"fail"}"><b>${s.label}</b><span>${s.status.present}/${s.status.total} panels present</span><em>${s.status.percent.toFixed(0)}%</em></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("workspace-consolidation-v96.updated",render);setTimeout(()=>render(),2000);}
window.WorkspaceSectionHealthV96={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
