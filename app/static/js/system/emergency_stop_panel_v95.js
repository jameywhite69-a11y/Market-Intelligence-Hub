/*
Version 95.0 — Emergency Stop Panel
*/
(function(){
const VERSION="95.0";
const KEY="mih.tios.emergency.stop.v95";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{armed:true,triggered:false,events:[]};}catch{return{armed:true,triggered:false,events:[]};}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function log(s,m){s.events.unshift({time:new Date().toLocaleTimeString(),message:m});s.events=s.events.slice(0,100);}
function trigger(){
 const s=load();
 s.triggered=true;s.armed=true;log(s,"Emergency stop triggered");
 window.ExecutionSimulatorV91?.reset?.();
 window.OrderManagementSystemV88?.reset?.();
 window.BrokerReadinessLayerV90?.setBroker?.("paper");
 return save(s);
}
function clear(){
 const s=load();
 s.triggered=false;s.armed=true;log(s,"Emergency stop cleared");
 return save(s);
}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("emergency-stop-v95.updated",{version:VERSION,state:snapshot()});}
function render(){
 const panel=document.getElementById("emergencyStopPanelV95");
 if(!panel)return;
 const s=snapshot();
 panel.innerHTML=`<section class="v95-card ${s.triggered?"danger":""}"><div class="v95-header"><div><h2>Emergency Stop</h2><span>global paper/sim execution kill switch</span></div><strong>${s.triggered?"TRIGGERED":"ARMED"}</strong></div><div class="v95-actions"><button id="v95TriggerStop">Trigger Stop</button><button id="v95ClearStop">Clear Stop</button></div><div class="v95-note"><b>Status</b><span>${s.triggered?"All simulation/OMS state has been stopped/reset.":"Emergency stop is armed and ready."}</span></div></section>`;
 document.getElementById("v95TriggerStop")?.addEventListener("click",trigger);
 document.getElementById("v95ClearStop")?.addEventListener("click",clear);
}
function wire(){setTimeout(render,2000);}
window.EmergencyStopPanelV95={trigger,clear,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
