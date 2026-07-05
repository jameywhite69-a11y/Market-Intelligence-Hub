(function(){
const VERSION="108.1";

const SECTIONS=[
 {id:"home",label:"⌂ Home",target:"portfolioSummaryCards"},
 {id:"overview",label:"Overview",target:"workspaceConsolidationPanelV96"},
 {id:"market",label:"Market",target:"marketRegimeEnginePanel"},
 {id:"opportunities",label:"Opportunities",target:"liveOpportunityEnginePanelV79"},
 {id:"ai",label:"AI",target:"aiTradingCommanderPanel"},
 {id:"execution",label:"Execution",target:"orderManagementSystemPanelV88"},
 {id:"broker",label:"Broker",target:"productionBrokerGatewayPanelV108"},
 {id:"portfolio",label:"Portfolio",target:"multiAccountRegistryPanelV104"},
 {id:"analytics",label:"Analytics",target:"institutionalAnalyticsEnginePanelV105"},
 {id:"coach",label:"Coach",target:"aiTradeCoachPanelV106"},
 {id:"alerts",label:"Alerts",target:"institutionalAlertCenterPanelV107"},
 {id:"replay",label:"Replay",target:"replayBacktestingEnginePanelV94"},
 {id:"system",label:"System",target:"productionReadinessGatePanelV95"}
];

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

function panelHtml(){
 return `<section class="v1081-native-nav-card">
  <div class="v1081-nav-header">
   <div>
    <h2>Workstation Navigation</h2>
    <span>native section shortcuts · home button · active section tracking</span>
   </div>
   <strong>V${VERSION}</strong>
  </div>
  <div class="v1081-native-nav-buttons">
   ${SECTIONS.map(s=>`<button data-v1081-target="${s.target}" data-v1081-section="${s.id}">${s.label}</button>`).join("")}
  </div>
 </section>`;
}

function ensurePanel(){
 let el=document.getElementById("nativeWorkstationNavigationPanelV108_1");
 if(el){
  el.innerHTML=panelHtml();
  return el;
 }

 const top=document.querySelector(".native-center-top");
 el=document.createElement("section");
 el.id="nativeWorkstationNavigationPanelV108_1";
 el.className="desk-panel compact wide-card";
 el.innerHTML=panelHtml();

 if(top){
  top.insertBefore(el, top.firstChild);
 }else{
  const center=document.querySelector(".native-tios-center")||document.body;
  center.insertBefore(el, center.firstChild);
 }
 return el;
}

function ensureFloatingHome(){
 let btn=document.getElementById("floatingHomeButtonV108_1");
 if(btn)return btn;
 btn=document.createElement("button");
 btn.id="floatingHomeButtonV108_1";
 btn.textContent="⌂ Home";
 btn.addEventListener("click",()=>scrollToTarget("portfolioSummaryCards"));
 document.body.appendChild(btn);
 return btn;
}

function bind(){
 const panel=ensurePanel();
 panel.querySelectorAll("[data-v1081-target]").forEach(btn=>{
  btn.addEventListener("click",()=>scrollToTarget(btn.dataset.v1081Target));
 });
 ensureFloatingHome();
 updateActive();
}

function updateActive(){
 const panel=document.getElementById("nativeWorkstationNavigationPanelV108_1");
 if(!panel)return;
 let active="home";
 SECTIONS.forEach(s=>{
  const el=document.getElementById(s.target);
  if(!el)return;
  const rect=el.getBoundingClientRect();
  if(rect.top<=140)active=s.id;
 });
 panel.querySelectorAll("[data-v1081-section]").forEach(btn=>{
  btn.classList.toggle("active",btn.dataset.v1081Section===active);
 });
 const floating=ensureFloatingHome();
 floating.classList.toggle("visible",window.scrollY>300);
}

function keyboard(e){
 if(e.target && ["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName))return;
 if((e.key||"").toLowerCase()==="h")scrollToTarget("portfolioSummaryCards");
}

function render(){
 bind();
 window.EventBus?.publish?.("native-workstation-navigation-v108-1.ready",{version:VERSION});
}

function wire(){
 render();
 window.addEventListener("scroll",updateActive,{passive:true});
 window.addEventListener("resize",updateActive);
 document.addEventListener("keydown",keyboard);
}

window.NativeWorkstationNavigationV108_1={render,scrollToTarget,sections:SECTIONS,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,900));
})();
