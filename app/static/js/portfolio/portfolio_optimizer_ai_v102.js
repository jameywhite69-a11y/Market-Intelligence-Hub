
(function(){
function snapshot(){
 const attr=window.PortfolioAttributionEngineV93?.build?.()||{};
 const strategies=window.StrategySDKV99?.list?.()||[];
 return {equity:attr.equity||100000,riskPct:attr.riskPct||0,totalPnl:attr.totalPnl||0,strategies:strategies.length};
}
function recommend(){
 const s=snapshot();
 const alloc=s.riskPct<1?2:s.riskPct<2?1:0.5;
 return {
   recommendedRiskPerTrade:alloc,
   maxConcurrentPositions:Math.max(3,Math.floor((s.equity||100000)/25000)),
   rebalance:s.totalPnl<0?"Reduce exposure":"Maintain allocation"
 };
}
function render(){
 const el=document.getElementById("portfolioOptimizerPanelV102");
 if(!el)return;
 const r=recommend();
 el.innerHTML=`<section class="v102-card">
 <h2>Portfolio Optimization AI</h2>
 <div>Risk / Trade: <b>${r.recommendedRiskPerTrade}%</b></div>
 <div>Max Positions: <b>${r.maxConcurrentPositions}</b></div>
 <div>Recommendation: <b>${r.rebalance}</b></div>
 </section>`;
}
window.PortfolioOptimizerAIV102={snapshot,recommend,render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
