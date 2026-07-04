(function(){
const VERSION="87.0";
function levels(){const top=window.LiveOpportunityEngineV79?.latest?.()?.[0]||{};const ai=window.AITradingAssistantV82?.recommendation?.()||{};return{symbol:top.symbol||ai.symbol||"—",entry:Number(top.entry||ai.entry||0),stop:Number(top.stop||ai.stop||0),tp1:Number(top.tp1||ai.tp1||0),tp2:Number(top.tp2||ai.tp2||0),action:ai.action||top.decision||"WAIT",score:Number(top.score||ai.score||0)};}
function render(){const panel=document.getElementById("chartOverlayEnginePanelV87");if(!panel)return;const l=levels();panel.innerHTML=`<section class="v87-card"><div class="v87-header"><div><h2>Chart Overlay Engine</h2><span>AI levels and execution map</span></div><strong>${l.action}</strong></div><div class="v87-level-grid"><div><small>Symbol</small><b>${l.symbol}</b></div><div><small>Entry</small><b>${l.entry.toFixed(2)}</b></div><div><small>Stop</small><b>${l.stop.toFixed(2)}</b></div><div><small>TP1</small><b>${l.tp1.toFixed(2)}</b></div><div><small>TP2</small><b>${l.tp2.toFixed(2)}</b></div><div><small>Score</small><b>${l.score.toFixed(1)}</b></div></div></section>`;}
function wire(){window.EventBus?.subscribe?.("live-opportunities.updated",render);window.EventBus?.subscribe?.("ai-trading-assistant.updated",render);setTimeout(render,1800);}
window.ChartOverlayEngineV87={levels,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
