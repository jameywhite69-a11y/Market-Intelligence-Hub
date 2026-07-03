(function(){
const VERSION="85.1";
const CRITICAL=["realtimeDataBusPanelV74","marketDataAdapterRegistryPanelV78","liveOpportunityEnginePanelV79","paperTradingAccountPanelV80","positionRiskManagerPanelV81","aiTradingAssistantPanelV82","paperTradingCommandCenterPanelV83","paperTradeJournalPanelV84","streamingMarketDataBusPanelV85"];
function validate(){
 const ids={}; document.querySelectorAll("[id]").forEach(el=>{ids[el.id]=ids[el.id]||[];ids[el.id].push(el);});
 const duplicates=Object.entries(ids).filter(([id,els])=>els.length>1).map(([id,els])=>({id,count:els.length}));
 const missingCritical=CRITICAL.filter(id=>!document.getElementById(id));
 return{version:VERSION,totalIds:Object.keys(ids).length,duplicates,missingCritical,status:(duplicates.length||missingCritical.length)?"REVIEW":"CLEAN"};
}
function render(){
 const panel=document.getElementById("panelIdValidatorPanelV85_1"); if(!panel)return;
 const v=validate(); const issues=[...v.duplicates.map(d=>`Duplicate: ${d.id} (${d.count})`),...v.missingCritical.map(id=>`Missing: ${id}`)];
 panel.innerHTML=`<section class="v851-card ${v.status.toLowerCase()}"><div class="v851-header"><div><h2>Panel ID Validator</h2><span>${v.totalIds} IDs checked</span></div><strong>${v.status}</strong></div><div class="v851-grid"><div><small>Duplicate IDs</small><b>${v.duplicates.length}</b></div><div><small>Missing Critical</small><b>${v.missingCritical.length}</b></div><div><small>Status</small><b>${v.status}</b></div><div><small>Version</small><b>${VERSION}</b></div></div><div class="v851-list">${(issues.length?issues:["No duplicate IDs or missing critical panels detected."]).map(x=>`<div><b>Check</b><span>${x}</span></div>`).join("")}</div></section>`;
}
window.PanelIdValidatorV851={validate,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,2000));
})();
