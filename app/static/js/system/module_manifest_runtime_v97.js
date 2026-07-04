/*
Version 97.0 — Module Manifest Runtime
Purpose:
- Moves the platform toward manifest-driven loading without breaking the existing loader.
- Audits registered scripts, groups, and dependency order.
- Paper/simulation safe. No live broker execution.
*/
(function(){
const VERSION="97.0";
const KEY="mih.tios.module.manifest.runtime.v97";

const GROUP_ORDER=[
 "core","system","settings","workspace","intelligence","scanner","market",
 "decision","institutional","portfolio","risk","trading","execution","broker",
 "positions","paper","ai","charts","analytics","automation","workstation",
 "timeline","journal","research","market_intelligence"
];

function scriptTags(){
 return Array.from(document.querySelectorAll("script[src]")).map((el,i)=>({index:i,src:el.getAttribute("src")||""}));
}
function groupOf(src){
 const m=String(src).match(/\/static\/js\/([^\/]+)\//);
 return m?m[1]:"root";
}
function buildManifest(){
 const rows=scriptTags().filter(x=>x.src.includes("/static/js/")).map(x=>({...x,group:groupOf(x.src),name:x.src.split("/").pop()}));
 const groups={};
 rows.forEach(r=>{groups[r.group]=groups[r.group]||[];groups[r.group].push(r);});
 return {version:VERSION,timestamp:new Date().toISOString(),rows,groups,order:GROUP_ORDER};
}
function validate(){
 const manifest=buildManifest();
 const duplicates=[];
 const seen=new Map();
 manifest.rows.forEach(r=>seen.set(r.src,(seen.get(r.src)||0)+1));
 seen.forEach((count,src)=>{if(count>1)duplicates.push({src,count});});

 const unknown=Object.keys(manifest.groups).filter(g=>g!=="root"&&!GROUP_ORDER.includes(g));
 const orderViolations=[];
 let last=-1;
 manifest.rows.forEach(r=>{
  const idx=GROUP_ORDER.indexOf(r.group);
  if(idx>=0){
   if(idx<last)orderViolations.push({src:r.src,group:r.group,expectedAfter:GROUP_ORDER[last]});
   last=Math.max(last,idx);
  }
 });

 const report={version:VERSION,total:manifest.rows.length,groups:Object.keys(manifest.groups).length,duplicates,unknown,orderViolations,status:(duplicates.length||unknown.length)?"REVIEW":"READY"};
 try{localStorage.setItem(KEY,JSON.stringify(report));}catch{}
 return report;
}
function exportHtml(){
 const manifest=buildManifest();
 return Object.entries(manifest.groups).map(([group,rows])=>{
  return `<!-- ${group.toUpperCase()} -->\n`+rows.map(r=>`<script src="${r.src}"></script>`).join("\n");
 }).join("\n\n");
}
function render(){
 const panel=document.getElementById("moduleManifestRuntimePanelV97");
 if(!panel)return;
 const v=validate();
 panel.innerHTML=`<section class="v97-card"><div class="v97-header"><div><h2>Module Manifest Runtime</h2><span>loader inventory · duplicate detection · migration prep</span></div><strong>${v.status}</strong></div><div class="v97-grid"><div><small>Scripts</small><b>${v.total}</b></div><div><small>Groups</small><b>${v.groups}</b></div><div><small>Duplicates</small><b>${v.duplicates.length}</b></div><div><small>Unknown</small><b>${v.unknown.length}</b></div><div><small>Order Notes</small><b>${v.orderViolations.length}</b></div><div><small>Mode</small><b>Audit</b></div></div><div class="v97-note"><b>Migration</b><span>V97 audits the current loader and prepares manifest migration. It does not dynamically replace the existing loader yet.</span></div></section>`;
 window.EventBus?.publish?.("module-manifest-runtime-v97.updated",{version:VERSION,report:v});
}
function wire(){setTimeout(render,1800);}
window.ModuleManifestRuntimeV97={buildManifest,validate,exportHtml,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
