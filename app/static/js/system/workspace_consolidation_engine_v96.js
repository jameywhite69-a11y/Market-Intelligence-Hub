/*
Version 96.0 — Workspace Consolidation & Polish Engine
Purpose:
- Consolidates the now-large trading workstation into workflow sections.
- Adds section state, quick navigation, and health summary.
- Paper/simulation safe. No live broker execution.
*/
(function(){
const VERSION="96.0";
const KEY="mih.tios.workspace.consolidation.v96";

const SECTIONS=[
 {id:"overview",label:"Overview",panels:["opportunityHeatmap","workspaceProfiles","institutionalIntegrationBusPanelV89","deploymentReadinessPanelV95"]},
 {id:"market",label:"Market Data",panels:["streamingMarketDataBusPanelV85","candleStreamPanelV85","streamHealthPanelV85","institutionalChartWorkspacePanelV87"]},
 {id:"opportunity",label:"Opportunities",panels:["liveOpportunityEnginePanelV79","liveOpportunityTapePanelV79","institutionalWatchlistPanel","opportunityQueue"]},
 {id:"decision",label:"AI / Decision",panels:["aiTradingCommanderPanel","aiTradingAssistantPanelV82","aiTradeGuidancePanelV82","institutionalDecisionPackagePanel"]},
 {id:"execution",label:"Execution",panels:["orderManagementSystemPanelV88","executionSimulatorPanelV91","multiBrokerAbstractionPanelV92","brokerReadinessLayerPanelV90"]},
 {id:"portfolio",label:"Portfolio",panels:["portfolioAttributionEnginePanelV93","exposureAttributionPanelV93","performanceAttributionPanelV93","positionRiskManagerPanelV81"]},
 {id:"review",label:"Review",panels:["paperTradeJournalPanelV84","replayBacktestingEnginePanelV94","replayMetricsPanelV94","executionAttributionPanelV93"]},
 {id:"system",label:"System",panels:["productionReadinessGatePanelV95","emergencyStopPanelV95","loaderPathValidatorPanelV85_1","moduleManifestLoaderPanelV86"]}
];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{active:"overview",compact:false};}catch{return{active:"overview",compact:false};}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));render();publish();return s;}
function exists(id){return !!document.getElementById(id);}
function sectionStatus(section){
 const present=section.panels.filter(exists).length;
 return {present,total:section.panels.length,ready:present>0,percent:section.panels.length?present/section.panels.length*100:0};
}
function activate(id){
 const s=load();
 s.active=id||s.active;
 save(s);
 scrollToSection(s.active);
 return s;
}
function scrollToSection(id){
 const sec=SECTIONS.find(x=>x.id===id);
 if(!sec)return;
 const first=sec.panels.map(p=>document.getElementById(p)).find(Boolean);
 if(first) first.scrollIntoView({behavior:"smooth",block:"start"});
}
function toggleCompact(){
 const s=load();
 s.compact=!s.compact;
 document.body.classList.toggle("v96-compact-workspace",s.compact);
 return save(s);
}
function snapshot(){
 const s=load();
 return {version:VERSION,state:s,sections:SECTIONS.map(sec=>({...sec,status:sectionStatus(sec)}))};
}
function publish(){window.EventBus?.publish?.("workspace-consolidation-v96.updated",snapshot());}
function render(){
 const panel=document.getElementById("workspaceConsolidationPanelV96");
 if(!panel)return;
 const snap=snapshot(), s=snap.state;
 document.body.classList.toggle("v96-compact-workspace",!!s.compact);
 panel.innerHTML=`<section class="v96-card"><div class="v96-header"><div><h2>Workspace Consolidation</h2><span>workflow navigation · section health · production polish</span></div><strong>${s.active.toUpperCase()}</strong></div><div class="v96-nav">${snap.sections.map(sec=>`<button data-section="${sec.id}" class="${sec.id===s.active?"active":""}">${sec.label}<small>${sec.status.present}/${sec.status.total}</small></button>`).join("")}</div><div class="v96-actions"><button id="v96ToggleCompact">${s.compact?"Normal Density":"Compact Density"}</button><button id="v96PublishState">Refresh Summary</button></div></section>`;
 panel.querySelectorAll("[data-section]").forEach(btn=>btn.addEventListener("click",()=>activate(btn.dataset.section)));
 document.getElementById("v96ToggleCompact")?.addEventListener("click",toggleCompact);
 document.getElementById("v96PublishState")?.addEventListener("click",publish);
}
function wire(){
 ["institutional-integration-v89.updated","production-readiness-v95.updated","replay-backtest-v94.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,1800);
}
window.WorkspaceConsolidationEngineV96={activate,toggleCompact,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
