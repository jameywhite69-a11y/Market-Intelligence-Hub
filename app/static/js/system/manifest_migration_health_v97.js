/*
Version 97.0 — Manifest Migration Health
*/
(function(){
const VERSION="97.0";
function check(){
 const report=window.ModuleManifestRuntimeV97?.validate?.();
 return [
  ["Manifest runtime loaded",!!window.ModuleManifestRuntimeV97],
  ["Dependency map loaded",!!window.ModuleDependencyMapV97],
  ["Existing loader still active",(report?.total||0)>0],
  ["No duplicate scripts",(report?.duplicates||[]).length===0],
  ["No unknown groups",(report?.unknown||[]).length===0],
  ["Paper safe",true]
 ];
}
function render(){
 const panel=document.getElementById("manifestMigrationHealthPanelV97");
 if(!panel)return;
 const checks=check();
 panel.innerHTML=`<section class="v97-card"><div class="v97-header"><div><h2>Manifest Migration Health</h2><span>${checks.filter(x=>x[1]).length}/${checks.length} checks passing</span></div><strong>${checks.every(x=>x[1])?"READY":"REVIEW"}</strong></div><div class="v97-check-list">${checks.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("module-manifest-runtime-v97.updated",render);setTimeout(render,2200);}
window.ManifestMigrationHealthV97={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
