(function(){
const catalog=[
{id:"ema_trend",name:"EMA Trend",version:"1.0.0",author:"TIOS",installed:false},
{id:"breakout",name:"Breakout",version:"1.0.0",author:"TIOS",installed:false},
{id:"mean_reversion",name:"Mean Reversion",version:"1.0.0",author:"TIOS",installed:false}
];
const installed=new Map();
function install(id){
 const item=catalog.find(x=>x.id===id); if(!item)return;
 item.installed=true; installed.set(id,item);
 window.EventBus?.publish?.("strategy-marketplace-v100.installed",item);
 render();
}
function uninstall(id){
 const item=catalog.find(x=>x.id===id); if(!item)return;
 item.installed=false; installed.delete(id);
 render();
}
function render(){
 const el=document.getElementById("strategyMarketplacePanelV100");
 if(!el)return;
 el.innerHTML=`<section class="v100-card"><h2>Strategy Marketplace</h2>
 ${catalog.map(s=>`<div class="row"><b>${s.name}</b><span>${s.version}</span><button data-id="${s.id}">${s.installed?"Installed":"Install"}</button></div>`).join("")}
 </section>`;
 el.querySelectorAll("button[data-id]").forEach(b=>b.onclick=()=>install(b.dataset.id));
}
window.StrategyMarketplaceV100={catalog,install,uninstall,installed:()=>[...installed.values()],render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
