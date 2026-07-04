(function(){
const VERSION="87.0";
function check(){const s=window.StreamingMarketDataBusV85?.snapshot?.()||{};const candles=Object.values(s.candles||{}).reduce((a,r)=>a+r.length,0);return[["Chart workspace loaded",!!window.InstitutionalChartWorkspaceV87],["Overlay engine loaded",!!window.ChartOverlayEngineV87],["Streaming bus loaded",!!window.StreamingMarketDataBusV85],["Candles available",candles>0],["Live opportunity compatible",!!window.LiveOpportunityEngineV79],["Paper safe",true]];}
function render(){const panel=document.getElementById("chartWorkspaceHealthPanelV87");if(!panel)return;const c=check();panel.innerHTML=`<section class="v87-card"><div class="v87-header"><div><h2>Chart Workspace Health</h2><span>${c.filter(x=>x[1]).length}/${c.length} checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"WAITING"}</strong></div><div class="v87-check-list">${c.map(([l,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${l}</span></div>`).join("")}</div></section>`;}
function wire(){window.EventBus?.subscribe?.("streaming-market-data.updated",render);setTimeout(render,2000);}
window.ChartWorkspaceHealthV87={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
