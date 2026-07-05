(function(){
const VERSION="107.0";
const KEY="mih.tios.alert.center.v107";
const DEFAULT_STATE={
 enabled:true,
 channels:[
  {id:"browser",name:"Browser",enabled:true,status:"ready"},
  {id:"webhook",name:"Webhook",enabled:false,status:"configured-later"},
  {id:"email",name:"Email",enabled:false,status:"configured-later"},
  {id:"sms",name:"SMS",enabled:false,status:"configured-later"},
  {id:"discord",name:"Discord",enabled:false,status:"configured-later"},
  {id:"telegram",name:"Telegram",enabled:false,status:"configured-later"},
  {id:"slack",name:"Slack",enabled:false,status:"configured-later"}
 ],
 alerts:[],
 rules:[
  {id:"a-plus-opportunity",name:"A+ Opportunity",enabled:true,source:"live-opportunities.updated"},
  {id:"oms-fill",name:"OMS Fill",enabled:true,source:"oms-v88.order-filled"},
  {id:"risk-elevated",name:"Risk Elevated",enabled:true,source:"portfolio-attribution-v93.updated"},
  {id:"production-lock",name:"Production Gate Locked",enabled:true,source:"production-readiness-v95.updated"}
 ]
};
function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function pushAlert(type,title,message,data){
 const s=load(); if(!s.enabled)return null;
 const alert={id:`ALERT-${Date.now()}`,time:new Date().toLocaleTimeString(),type,title,message,data:data||{},ack:false};
 s.alerts.unshift(alert); s.alerts=s.alerts.slice(0,200); save(s);
 window.EventBus?.publish?.("institutional-alert-center-v107.alert",alert);
 return alert;
}
function ack(id){const s=load();const a=s.alerts.find(x=>x.id===id);if(a)a.ack=true;return save(s);}
function toggleChannel(id){const s=load();const ch=s.channels.find(x=>x.id===id);if(ch)ch.enabled=!ch.enabled;return save(s);}
function handleOpportunity(payload){
 const rows=payload?.opportunities||payload?.items||window.LiveOpportunityEngineV79?.latest?.()||[];
 const top=Array.isArray(rows)?rows[0]:null;
 if(top&&Number(top.score||0)>=88){pushAlert("opportunity","A+ Opportunity",`${top.symbol||"—"} scored ${Number(top.score||0).toFixed(1)}`,top);}
}
function handleFill(payload){const order=payload?.order||{};pushAlert("execution","OMS Fill",`${order.symbol||"—"} order filled`,payload);}
function handleRisk(payload){const m=payload||window.PortfolioAttributionEngineV93?.build?.()||{};if(Number(m.riskPct||0)>=2){pushAlert("risk","Risk Elevated",`Portfolio risk is ${Number(m.riskPct||0).toFixed(2)}%`,m);}}
function handleProduction(payload){const r=payload?.readiness||window.ProductionReadinessGateV95?.readiness?.();if(r&&!r.eligible){pushAlert("system","Production Gate Locked","Live trading remains locked by readiness gate.",r);}}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("institutional-alert-center-v107.updated",{version:VERSION,state:snapshot()});}
function render(){
 const el=document.getElementById("institutionalAlertCenterPanelV107"); if(!el)return;
 const s=snapshot(); const unread=s.alerts.filter(a=>!a.ack).length;
 el.innerHTML=`<section class="v107-card"><div class="v107-header"><div><h2>Institutional Alert Center</h2><span>browser · webhook · email · SMS · Discord · Telegram · Slack</span></div><strong>${unread} NEW</strong></div><div class="v107-grid"><div><small>Total</small><b>${s.alerts.length}</b></div><div><small>Unread</small><b>${unread}</b></div><div><small>Channels</small><b>${s.channels.filter(c=>c.enabled).length}/${s.channels.length}</b></div><div><small>Rules</small><b>${s.rules.filter(r=>r.enabled).length}/${s.rules.length}</b></div></div><div class="v107-actions">${s.channels.map(c=>`<button data-channel="${c.id}" class="${c.enabled?"on":"off"}">${c.name}</button>`).join("")}</div></section>`;
 el.querySelectorAll("[data-channel]").forEach(btn=>btn.addEventListener("click",()=>toggleChannel(btn.dataset.channel)));
}
function wire(){
 window.EventBus?.subscribe?.("live-opportunities.updated",handleOpportunity);
 window.EventBus?.subscribe?.("oms-v88.order-filled",handleFill);
 window.EventBus?.subscribe?.("portfolio-attribution-v93.updated",handleRisk);
 window.EventBus?.subscribe?.("production-readiness-v95.updated",handleProduction);
 setTimeout(render,1500);
}
window.InstitutionalAlertCenterV107={pushAlert,ack,toggleChannel,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
