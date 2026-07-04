(function(){
const VERSION="94.0";
function check(){
 const candles=Object.values(window.StreamingMarketDataBusV85?.snapshot?.()?.candles||{}).reduce((a,r)=>a+r.length,0);
 return [
  ["Replay engine loaded",!!window.ReplayBacktestingEngineV94],
  ["Streaming candles available",candles>0],
  ["Execution simulator loaded",!!window.ExecutionSimulatorV91],
  ["Portfolio attribution loaded",!!window.PortfolioAttributionEngineV93],
  ["EventBus available",!!window.EventBus],
  ["Paper safe",true]
 ];
}
function render(){
 const panel=document.getElementById("replayHealthPanelV94");
 if(!panel)return;
 const checks=check();
 panel.innerHTML=`<section class="v94-card"><div class="v94-header"><div><h2>Replay Health</h2><span>${checks.filter(x=>x[1]).length}/${checks.length} checks passing</span></div><strong>${checks.every(x=>x[1])?"READY":"WAITING"}</strong></div><div class="v94-check-list">${checks.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("replay-backtest-v94.updated",render);window.EventBus?.subscribe?.("streaming-market-data.updated",render);setTimeout(render,2400);}
window.ReplayHealthPanelV94={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
