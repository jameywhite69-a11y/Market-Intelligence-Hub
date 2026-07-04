(function(){
const samples=[
{id:"sample.strategy",name:"Sample Strategy Plugin",status:"available"},
{id:"sample.analytics",name:"Analytics Extension",status:"available"}
];
function render(){
 const el=document.getElementById("pluginMarketplacePanelV98");
 if(!el) return;
 el.innerHTML=`<section class="v98-card"><h2>Plugin Marketplace (Local)</h2>
 ${samples.map(s=>`<div>${s.name} - ${s.status}</div>`).join("")}
 </section>`;
}
window.PluginMarketplaceV98={render,samples};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1200));
})();
