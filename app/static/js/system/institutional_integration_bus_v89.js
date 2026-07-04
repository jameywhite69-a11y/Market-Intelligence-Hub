/*
Version 89.0 — Institutional Integration Bus
Purpose:
- Unifies scanner, opportunities, AI, charts, OMS, paper account, and portfolio state.
- Publishes one canonical institutional workflow snapshot.
- Paper safe. No live broker execution.
*/
(function(){
const VERSION="89.0";
const KEY="mih.tios.integration.v89.last";

function safe(fn,fallback){try{return fn();}catch{return fallback;}}
function topOpportunity(){return safe(()=>window.LiveOpportunityEngineV79.latest()[0],{})||{};}
function opportunities(){return safe(()=>window.LiveOpportunityEngineV79.latest(),[])||[];}
function ai(){return safe(()=>window.AITradingAssistantV82.recommendation(),{})||{};}
function oms(){return safe(()=>window.OrderManagementSystemV88.snapshot(),{orders:[],audit:[]})||{orders:[],audit:[]};}
function paper(){return safe(()=>window.PaperTradingAccountV80.snapshot(),{positions:[],orders:[],trades:[],cash:0,equity:0})||{};}
function risk(){return safe(()=>window.PositionRiskManagerV81.analyze(),{positions:[],riskPct:0,status:"Waiting"})||{};}
function stream(){return safe(()=>window.StreamingMarketDataBusV85.snapshot(),{quotes:{},candles:{},enabled:false})||{};}
function chart(){return safe(()=>window.InstitutionalChartWorkspaceV87.state(),{})||{};}

function readiness(snapshot){
 const o=snapshot.topOpportunity||{};
 const a=snapshot.ai||{};
 const r=snapshot.risk||{};
 const om=snapshot.oms||{};
 const score=Number(o.score||a.score||0);
 const confidence=Number(o.confidence||a.confidence||0);
 const riskPct=Number(r.riskPct||0);
 const queued=(om.orders||[]).filter(x=>["VALIDATED","QUEUED","SENT"].includes(x.status)).length;
 let status="WAIT";
 let reason="Waiting for qualified opportunity.";
 if(score>=88&&confidence>=80&&riskPct<2) {status="READY";reason="Opportunity, AI confidence, and risk budget align.";}
 else if(score>=75){status="WATCH";reason="Opportunity is developing but not fully executable.";}
 if(queued>0){reason+=" OMS has active workflow items.";}
 return {status,reason,score,confidence,riskPct,queued};
}

function snapshot(){
 const s={
  version:VERSION,
  timestamp:new Date().toISOString(),
  stream:stream(),
  opportunities:opportunities(),
  topOpportunity:topOpportunity(),
  ai:ai(),
  chart:chart(),
  oms:oms(),
  paper:paper(),
  risk:risk()
 };
 s.readiness=readiness(s);
 return s;
}

function publish(reason){
 const s=snapshot();
 s.reason=reason||"integration";
 try{localStorage.setItem(KEY,JSON.stringify({timestamp:s.timestamp,readiness:s.readiness,topOpportunity:s.topOpportunity}));}catch{}
 window.EventBus?.publish?.("institutional-integration-v89.updated",s);
 render(s);
 return s;
}

function render(s){
 const panel=document.getElementById("institutionalIntegrationBusPanelV89");
 if(!panel)return;
 s=s||snapshot();
 const open=(s.paper.positions||[]).filter(p=>p.status==="OPEN").length;
 const orders=(s.oms.orders||[]).length;
 panel.innerHTML=`<section class="v89-card ${String(s.readiness.status).toLowerCase()}"><div class="v89-header"><div><h2>Institutional Integration Bus</h2><span>scanner → opportunity → AI → chart → OMS → paper → portfolio</span></div><strong>${s.readiness.status}</strong></div><div class="v89-grid"><div><small>Top Symbol</small><b>${s.topOpportunity.symbol||"—"}</b></div><div><small>Score</small><b>${Number(s.readiness.score||0).toFixed(1)}</b></div><div><small>Confidence</small><b>${Number(s.readiness.confidence||0).toFixed(1)}%</b></div><div><small>Risk</small><b>${Number(s.readiness.riskPct||0).toFixed(2)}%</b></div><div><small>OMS Orders</small><b>${orders}</b></div><div><small>Open Pos.</small><b>${open}</b></div></div><div class="v89-note"><b>Integration Status</b><span>${s.readiness.reason}</span></div></section>`;
}

function wire(){
 const events=[
  "streaming-market-data.updated","realtime-data.updated","live-opportunities.updated",
  "ai-trading-assistant.updated","oms-v88.updated","paper-trading-account.updated",
  "position-risk-v81.updated","chart-workspace-v87.symbol-changed"
 ];
 events.forEach(e=>window.EventBus?.subscribe?.(e,()=>publish(e)));
 setTimeout(()=>publish("bootstrap"),1800);
}

window.InstitutionalIntegrationBusV89={snapshot,publish,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
