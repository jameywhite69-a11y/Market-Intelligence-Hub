(function(){
const VERSION="94.0";
function metrics(){
 const s=window.ReplayBacktestingEngineV94?.snapshot?.()||{};
 const attr=window.PortfolioAttributionEngineV93?.build?.()||{};
 return {symbol:s.symbol||"—",index:Number(s.index||0),running:!!s.running,totalPnl:Number(attr.totalPnl||0),winRate:Number(attr.winRate||0),riskPct:Number(attr.riskPct||0),fills:attr.fillStats?.fills||0};
}
function render(){
 const panel=document.getElementById("replayMetricsPanelV94");
 if(!panel)return;
 const m=metrics();
 panel.innerHTML=`<section class="v94-card"><div class="v94-header"><div><h2>Replay Metrics</h2><span>paper replay performance snapshot</span></div><strong>${m.running?"LIVE":"IDLE"}</strong></div><div class="v94-grid"><div><small>Symbol</small><b>${m.symbol}</b></div><div><small>Bars</small><b>${m.index}</b></div><div><small>P/L</small><b>$${m.totalPnl.toFixed(2)}</b></div><div><small>Win Rate</small><b>${m.winRate.toFixed(1)}%</b></div><div><small>Risk</small><b>${m.riskPct.toFixed(2)}%</b></div><div><small>Fills</small><b>${m.fills}</b></div></div></section>`;
}
function wire(){
 window.EventBus?.subscribe?.("replay-backtest-v94.updated",render);
 window.EventBus?.subscribe?.("portfolio-attribution-v93.updated",render);
 setTimeout(render,2200);
}
window.ReplayMetricsPanelV94={metrics,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
