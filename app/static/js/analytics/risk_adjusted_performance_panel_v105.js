(function(){
const VERSION="105.0";
function render(m){
 const el=document.getElementById("riskAdjustedPerformancePanelV105");
 if(!el)return;
 m=m||window.InstitutionalAnalyticsEngineV105?.calc?.()||{};
 el.innerHTML=`<section class="v105-card"><div class="v105-header"><div><h2>Risk-Adjusted Performance</h2><span>professional performance ratios</span></div><strong>${Number(m.sharpe||0).toFixed(2)}</strong></div><div class="v105-list"><div><b>Sharpe Ratio</b><span>Return per unit of volatility</span><em>${Number(m.sharpe||0).toFixed(2)}</em></div><div><b>Sortino Ratio</b><span>Return per downside risk</span><em>${Number(m.sortino||0).toFixed(2)}</em></div><div><b>Calmar Ratio</b><span>Return vs drawdown</span><em>${Number(m.calmar||0).toFixed(2)}</em></div></div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-analytics-v105.updated",render);setTimeout(()=>render(),1800);}
window.RiskAdjustedPerformancePanelV105={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
