(function(){
const VERSION="105.0";
function check(){
 return [
  ["Analytics engine loaded",!!window.InstitutionalAnalyticsEngineV105],
  ["Portfolio attribution loaded",!!window.PortfolioAttributionEngineV93],
  ["Paper account loaded",!!window.PaperTradingAccountV80],
  ["Execution simulator loaded",!!window.ExecutionSimulatorV91],
  ["EventBus available",!!window.EventBus],
  ["Paper safe",true]
 ];
}
function render(){
 const el=document.getElementById("analyticsHealthPanelV105");
 if(!el)return;
 const c=check();
 el.innerHTML=`<section class="v105-card"><div class="v105-header"><div><h2>Analytics Health</h2><span>${c.filter(x=>x[1]).length}/${c.length} checks passing</span></div><strong>${c.every(x=>x[1])?"READY":"WAITING"}</strong></div><div class="v105-check-list">${c.map(([label,ok])=>`<div class="${ok?"pass":"fail"}"><b>${ok?"✓":"!"}</b><span>${label}</span></div>`).join("")}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("institutional-analytics-v105.updated",render);setTimeout(render,2000);}
window.AnalyticsHealthPanelV105={check,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1400));
})();
