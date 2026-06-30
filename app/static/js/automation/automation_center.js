(function(){
const KEY="mih.automation.rules";
const defaults=[
{id:"scan90",name:"Scanner ≥90 → AI + Risk",enabled:true},
{id:"approvedQueue",name:"Risk Approved → Queue Paper Trade",enabled:false},
{id:"filledLifecycle",name:"Paper Fill → Lifecycle",enabled:true}
];
function load(){try{return JSON.parse(localStorage.getItem(KEY))||defaults;}catch{return defaults;}}
function save(r){localStorage.setItem(KEY,JSON.stringify(r));}
window.AutomationCenter={
 rules:load(),
 toggle(id){
   this.rules=this.rules.map(r=>r.id===id?({...r,enabled:!r.enabled}):r);
   save(this.rules);
   render();
 }
};
function render(){
 const el=document.getElementById("automationCenterPanel"); if(!el)return;
 el.innerHTML=`<section class="automation-card">
 <div class="terminal-card-header"><h3>Automation Center</h3><span>${window.AutomationCenter.rules.filter(r=>r.enabled).length} Active</span></div>
 ${window.AutomationCenter.rules.map(r=>`<div class="auto-row"><span>${r.name}</span><button data-id="${r.id}">${r.enabled?"ON":"OFF"}</button></div>`).join("")}
 </section>`;
 el.querySelectorAll("button[data-id]").forEach(b=>b.onclick=()=>window.AutomationCenter.toggle(b.dataset.id));
}
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,300));
})();
