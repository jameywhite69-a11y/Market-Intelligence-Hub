/*
Version 68.0 - AI Trade Review & Coaching (paper analytics)
*/
(function(){
const VERSION="68.0";
function reviews(){
 const m=window.PerformanceAnalyticsEngineV67?.metrics?.()||{};
 return (m.trades||[]).map(t=>({
   symbol:t.symbol,
   strategy:t.strategy,
   grade:t.pnl>0?"A":"C",
   lesson:t.pnl>0?"Trend followed and risk controlled.":"Review entry timing and stop placement.",
   improvement:t.pnl>0?"Scale winners consistently.":"Wait for higher-confidence confirmation.",
   pnl:t.pnl,r:t.r
 }));
}
function render(){
 const el=document.getElementById("aiTradeReviewPanelV68");
 if(!el)return;
 const data=reviews();
 el.innerHTML=`<section class="v68-card">
 <h2>AI Trade Review & Coaching</h2>
 <p>Paper-trade coaching based on completed analytics.</p>
 ${data.map(d=>`<div class="v68-row"><b>${d.symbol}</b><span>${d.strategy}</span><em>${d.grade}</em><p>${d.lesson}<br><small>${d.improvement}</small></p></div>`).join("")}
 </section>`;
}
window.AITradeReviewEngineV68={reviews,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1800));
})();
