(function(){
const VERSION="85.1";
const GROUPS=["core","system","workspace","market","scanner","charts","ai","paper","execution","broker","portfolio","risk","analytics","automation","shared"];
function scripts(){return Array.from(document.querySelectorAll("script[src]")).map(s=>s.getAttribute("src"));}
function group(src){const m=String(src||"").match(/\/static\/js\/([^/]+)\//);return m?m[1]:"root";}
function validate(){
 const srcs=scripts(); const seen=new Map(); const duplicates=[]; const unknownGroups=[];
 srcs.forEach(src=>{seen.set(src,(seen.get(src)||0)+1); const g=group(src); if(g!=="root"&&!GROUPS.includes(g))unknownGroups.push({src,group:g});});
 seen.forEach((count,src)=>{if(count>1)duplicates.push({src,count});});
 const wrongLikelyPaths=srcs.filter(src=>{const s=src.toLowerCase();return s.includes("/workstation/streaming_")||s.includes("/workstation/realtime_")||s.includes("/workstation/paper_")||s.includes("/workstation/ai_")||s.includes("/workstation/market_");});
 return{version:VERSION,totalScripts:srcs.length,duplicates,unknownGroups,wrongLikelyPaths,status:(duplicates.length||unknownGroups.length||wrongLikelyPaths.length)?"REVIEW":"CLEAN"};
}
function render(){
 const panel=document.getElementById("loaderPathValidatorPanelV85_1"); if(!panel)return;
 const v=validate(); const issues=[...v.wrongLikelyPaths,...v.duplicates.map(d=>`Duplicate ${d.src} x${d.count}`),...v.unknownGroups.map(g=>`Unknown group ${g.group}: ${g.src}`)];
 panel.innerHTML=`<section class="v851-card ${v.status.toLowerCase()}"><div class="v851-header"><div><h2>Loader Path Validator</h2><span>${v.totalScripts} script tags checked</span></div><strong>${v.status}</strong></div><div class="v851-grid"><div><small>Duplicates</small><b>${v.duplicates.length}</b></div><div><small>Unknown Groups</small><b>${v.unknownGroups.length}</b></div><div><small>Wrong Paths</small><b>${v.wrongLikelyPaths.length}</b></div><div><small>Status</small><b>${v.status}</b></div></div><div class="v851-list">${(issues.length?issues:["No obvious wrong-path script tags found."]).map(x=>`<div><b>Check</b><span>${x}</span></div>`).join("")}</div></section>`;
}
window.LoaderPathValidatorV851={validate,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1800));
})();
