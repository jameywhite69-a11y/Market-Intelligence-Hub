/*
Version 89.0 — Workflow Synchronizer
Purpose:
- Pushes V89 canonical state into older placeholder panels without replacing their engines.
- Reduces empty/awaiting panels when data already exists elsewhere.
*/
(function(){
const VERSION="89.0";

function setText(id,html){
 const el=document.getElementById(id);
 if(!el)return false;
 if(el.dataset.v89Managed==="locked")return false;
 el.dataset.v89Managed="true";
 el.innerHTML=html;
 return true;
}

function card(title,body,meta){
 return `<section class="v89-card"><div class="v89-header"><div><h2>${title}</h2><span>${meta||"integrated workflow state"}</span></div></div>${body}</section>`;
}

function renderOpportunityQueue(s){
 const rows=(s.opportunities||[]).slice(0,6);
 return card("Opportunity Queue",`<div class="v89-list">${rows.map((o,i)=>`<div><b>#${i+1} ${o.symbol||"—"}</b><span>${Number(o.score||0).toFixed(1)} · ${o.decision||"WAIT"}</span><em>${o.grade||""}</em></div>`).join("")||"<div><b>Waiting</b><span>No live opportunities yet.</span><em>—</em></div>"}</div>`,"V79 live opportunity feed");
}

function renderExecutionReadiness(s){
 const r=s.readiness||{};
 return card("Execution Readiness",`<div class="v89-grid"><div><small>Status</small><b>${r.status||"WAIT"}</b></div><div><small>Score</small><b>${Number(r.score||0).toFixed(1)}</b></div><div><small>Confidence</small><b>${Number(r.confidence||0).toFixed(1)}%</b></div><div><small>Risk</small><b>${Number(r.riskPct||0).toFixed(2)}%</b></div></div><div class="v89-note"><b>Reason</b><span>${r.reason||"Awaiting workflow state."}</span></div>`,"AI + OMS + risk alignment");
}

function renderInstitutionalWatchlist(s){
 const rows=(s.opportunities||[]).slice(0,8);
 const elite=rows.filter(o=>Number(o.score||0)>=88).length;
 const watch=rows.filter(o=>Number(o.score||0)>=70&&Number(o.score||0)<88).length;
 const avoid=rows.filter(o=>Number(o.score||0)<70).length;
 return card("Institutional Watchlist",`<div class="v89-grid"><div><small>A+ Elite</small><b>${elite}</b></div><div><small>Watch</small><b>${watch}</b></div><div><small>Avoid</small><b>${avoid}</b></div><div><small>Total</small><b>${rows.length}</b></div></div><div class="v89-list">${rows.slice(0,4).map(o=>`<div><b>${o.symbol}</b><span>${Number(o.score||0).toFixed(1)}</span><em>${o.decision||"WAIT"}</em></div>`).join("")}</div>`,"scanner/opportunity ranked list");
}

function renderHeatMap(s){
 const rows=(s.opportunities||[]).slice(0,5);
 return card("Opportunity Heat Map",`<div class="v89-bars">${rows.map(o=>`<div><b>${o.symbol||"—"}</b><span><i style="width:${Math.max(5,Math.min(100,Number(o.score||0)))}%"></i></span><em>${Number(o.score||0).toFixed(1)}</em></div>`).join("")||"<div><b>Waiting</b><span><i style='width:5%'></i></span><em>—</em></div>"}</div>`,"canonical V89 opportunity scores");
}

function renderWorkspaceProfile(s){
 const stream=s.stream||{};
 const quoteCount=Object.keys(stream.quotes||{}).length;
 return card("Workspace Profile",`<div class="v89-grid"><div><small>Mode</small><b>Paper</b></div><div><small>Stream</small><b>${stream.enabled?"Live":"Paused"}</b></div><div><small>Quotes</small><b>${quoteCount}</b></div><div><small>Workflow</small><b>${s.readiness?.status||"WAIT"}</b></div></div>`,"integrated workstation profile");
}

function sync(s){
 if(!s)return;
 setText("opportunityQueue",renderOpportunityQueue(s));
 setText("executionReadinessPanel",renderExecutionReadiness(s));
 setText("institutionalWatchlistPanel",renderInstitutionalWatchlist(s));
 setText("opportunityHeatmap",renderHeatMap(s));
 setText("workspaceProfiles",renderWorkspaceProfile(s));
 window.EventBus?.publish?.("workflow-synchronizer-v89.updated",{version:VERSION,timestamp:new Date().toISOString()});
}

function wire(){
 window.EventBus?.subscribe?.("institutional-integration-v89.updated",sync);
 setTimeout(()=>sync(window.InstitutionalIntegrationBusV89?.snapshot?.()),2400);
}

window.WorkflowSynchronizerV89={sync,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
