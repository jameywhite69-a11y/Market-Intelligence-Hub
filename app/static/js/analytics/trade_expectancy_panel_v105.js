(function(){
const VERSION="105.0";
function render(m){
 const el=document.getElementById("tradeExpectancyPanelV105");
 if(!el)return;
 m=m||window.InstitutionalAnalyticsEngineV105?.calc?.()||{};
 el.innerHTML=`<section class="v105-card"><div class="v105-header"><div><h2>Trade Expectancy</h2><span>edge quality and payoff profile</span></div><strong>$${Number(m.expectancy||0).toFixed(2)}</strong></div><div class="v105-grid"><div><small>Trades</small><b>${m.tradeCount||0}</b></div><div><small>Win Rate</small><b>${Number(m.winRate||0).toFixed(1)}%</b></div><div><small>Profit Factor</small><b>${Number(m.profitFactor||0).toFixed(2)}</b></div><div><small>Avg Trade</small><b>$${Number(m.avgTrade||0).toFixed(2)}</b></div><div><small>Kelly</small><b>${(Number(m.kelly||0)*100).toFixed(1)}%</b></div><div><small>Drawdown</small><b>$${Number(m.maxDrawdown||0).toFixed(2)}</b></div></div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-analytics-v105.updated",render);setTimeout(()=>render(),1900);}
window.TradeExpectancyPanelV105={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
