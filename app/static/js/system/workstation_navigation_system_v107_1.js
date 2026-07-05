(function(){
const VERSION="107.1";
const SECTIONS=[
 {id:"home",label:"Home",target:"top"},
 {id:"overview",label:"Overview",target:"workspaceConsolidationPanelV96"},
 {id:"market",label:"Market",target:"marketRegimeEnginePanel"},
 {id:"opportunities",label:"Opportunities",target:"liveOpportunityEnginePanelV79"},
 {id:"ai",label:"AI",target:"aiTradingCommanderPanel"},
 {id:"execution",label:"Execution",target:"orderManagementSystemPanelV88"},
 {id:"broker",label:"Broker",target:"brokerReadinessLayerPanelV90"},
 {id:"portfolio",label:"Portfolio",target:"multiAccountRegistryPanelV104"},
 {id:"analytics",label:"Analytics",target:"institutionalAnalyticsEnginePanelV105"},
 {id:"replay",label:"Replay",target:"replayBacktestingEnginePanelV94"},
 {id:"system",label:"System",target:"productionReadinessGatePanelV95"}
];

function findTop(){
 return document.getElementById("portfolioSummaryCards") ||
        document.querySelector(".native-tios-center") ||
        document.body;
}

function scrollToTarget(target){
 if(target==="top"){
   window.scrollTo({top:0,behavior:"smooth"});
   return;
 }
 const el=document.getElementById(target);
 if(el){
   el.scrollIntoView({behavior:"smooth",block:"start"});
 }else{
   window.scrollTo({top:0,behavior:"smooth"});
 }
}

function buildBar(){
 let bar=document.getElementById("workstationNavigationBarV107_1");
 if(bar) return bar;
 bar=document.createElement("div");
 bar.id="workstationNavigationBarV107_1";
 bar.innerHTML=`<div class="v1071-nav-inner">
   ${SECTIONS.map(s=>`<button data-section="${s.id}" data-target="${s.target}" class="${s.id==="home"?"home":""}">${s.id==="home"?"⌂ ":""}${s.label}</button>`).join("")}
 </div>`;
 document.body.appendChild(bar);
 bar.querySelectorAll("button[data-target]").forEach(btn=>{
   btn.addEventListener("click",()=>scrollToTarget(btn.dataset.target));
 });
 return bar;
}

function buildFloatingHome(){
 let btn=document.getElementById("floatingHomeButtonV107_1");
 if(btn) return btn;
 btn=document.createElement("button");
 btn.id="floatingHomeButtonV107_1";
 btn.textContent="⌂ Home";
 btn.addEventListener("click",()=>scrollToTarget("top"));
 document.body.appendChild(btn);
 return btn;
}

function updateActive(){
 const bar=buildBar();
 const buttons=[...bar.querySelectorAll("button[data-target]")];
 let active="home";
 for(const section of SECTIONS){
   if(section.target==="top") continue;
   const el=document.getElementById(section.target);
   if(!el) continue;
   const rect=el.getBoundingClientRect();
   if(rect.top<=120) active=section.id;
 }
 buttons.forEach(btn=>btn.classList.toggle("active",btn.dataset.section===active));
 const floating=buildFloatingHome();
 floating.classList.toggle("visible",window.scrollY>300);
}

function keyboard(e){
 if(e.target && ["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName)) return;
 if(e.key && e.key.toLowerCase()==="h"){
   scrollToTarget("top");
 }
}

function render(){
 buildBar();
 buildFloatingHome();
 updateActive();
}

function wire(){
 render();
 window.addEventListener("scroll",updateActive,{passive:true});
 window.addEventListener("resize",updateActive);
 document.addEventListener("keydown",keyboard);
 window.EventBus?.publish?.("workstation-navigation-v107-1.ready",{version:VERSION});
}

window.WorkstationNavigationSystemV107_1={render,scrollToTarget,sections:SECTIONS,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,900));
})();
