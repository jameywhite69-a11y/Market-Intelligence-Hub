(function(){
function metric(label,value){const v=Number(value||0);return `<div class="decision-metric"><b>${label}</b><span>${v}</span><div class="decision-meter"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`;}
function renderDecisionPipelinePanel(){
 const panel=document.getElementById("decisionPipelinePanel"); if(!panel)return;
 const d=window.DecisionEngine?.current?.()||window.WorkspaceStore?.get?.("currentDecision");
 if(!d){panel.innerHTML=`<section class="decision-pipeline-card"><div class="terminal-card-header"><h3>Decision Intelligence</h3><span>Waiting</span></div><p class="muted">Select an opportunity to generate a decision.</p></section>`;return;}
 const s=d.institutionalScore||{};
 panel.innerHTML=`<section class="decision-pipeline-card ${String(d.recommendation).toLowerCase().replaceAll(" ","-")}">
 <div class="terminal-card-header"><h3>Decision Intelligence</h3><span>${d.recommendation}</span></div>
 <div class="decision-hero"><div><b>${d.symbol}</b><span>${d.timeframe} · ${d.strategy}</span></div><strong>${s.overall} · ${s.grade}</strong></div>
 <div class="decision-score-grid">${metric("Trend",s.trend)}${metric("Momentum",s.momentum)}${metric("Structure",s.structure)}${metric("Risk",s.risk)}${metric("Portfolio Fit",s.portfolioFit)}${metric("Execution",s.execution)}${metric("Catalyst",s.catalyst)}${metric("Overall",s.overall)}</div>
 <div class="decision-narrative"><b>AI-Ready Narrative</b><p>${d.narrative}</p></div></section>`;
}
window.EventBus?.subscribe?.("decision.updated",renderDecisionPipelinePanel);
window.EventBus?.subscribe?.("unified-opportunity.changed",()=>setTimeout(renderDecisionPipelinePanel,50));
document.addEventListener("DOMContentLoaded",()=>setTimeout(renderDecisionPipelinePanel,1100));
window.DecisionPipelinePanel={renderDecisionPipelinePanel};
})();
