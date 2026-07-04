(function(){
function render(){
 const el=document.getElementById("strategyManagerPanelV99");
 if(!el)return;
 const list=window.StrategySDKV99?.list?.()||[];
 el.innerHTML=`<section class="v99-card"><h2>Strategy Manager</h2>
 ${list.length?list.map(s=>`<div>${s.id}</div>`).join(""):"No registered strategies."}
 </section>`;
}
window.StrategyManagerV99={render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1200));
})();
