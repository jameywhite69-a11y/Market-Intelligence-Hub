(function(){
function render(){
 const el=document.getElementById("packageManagerPanelV100");
 if(!el)return;
 const pkgs=window.StrategyMarketplaceV100?.installed?.()||[];
 el.innerHTML=`<section class="v100-card"><h2>Package Manager</h2>
 <p>Installed Packages: <b>${pkgs.length}</b></p>
 ${pkgs.map(p=>`<div>${p.name} ${p.version}</div>`).join("")||"No installed packages."}
 </section>`;
}
window.PackageManagerV100={render};
document.addEventListener("DOMContentLoaded",()=>{
 setTimeout(render,1200);
 window.EventBus?.subscribe?.("strategy-marketplace-v100.installed",render);
});
})();
