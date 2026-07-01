(function(){
function metric(label,value){const v=Number(value||0);return `<div class="institutional-metric"><b>${label}</b><span>${v.toFixed(0)}</span><div class="institutional-meter"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`;}
function renderInstitutionalIntelligencePanel(){
 const panel=document.getElementById("institutionalIntelligencePanel"); if(!panel)return;
 const score=window.InstitutionalScoringEngine?.current?.(), consensus=window.StrategyConsensusEngine?.current?.();
 if(!score){panel.innerHTML=`<section class="institutional-intelligence-card"><div class="terminal-card-header"><h3>Institutional Intelligence</h3><span>Waiting</span></div><p class="muted">Select an opportunity to generate institutional intelligence.</p></section>`;return;}
 const c=score.components||{};
 panel.innerHTML=`<section class="institutional-intelligence-card ${String(score.institutionalState).toLowerCase()}">
 <div class="terminal-card-header"><h3>Institutional Intelligence</h3><span>${score.institutionalState}</span></div>
 <div class="institutional-intelligence-hero"><div><b>${score.symbol}</b><span>${score.timeframe} · ${score.strategy}</span></div><strong>${score.overall}<small>${score.grade}</small></strong></div>
 <div class="institutional-consensus"><b>Strategy Consensus</b><span>${consensus?.passCount||0}/${consensus?.total||0} · ${consensus?.alignment||0}%</span></div>
 <div class="institutional-metric-grid">${metric("Trend",c.trend)}${metric("Momentum",c.momentum)}${metric("Structure",c.structure)}${metric("Liquidity",c.liquidity)}${metric("Volatility",c.volatility)}${metric("Portfolio Fit",c.portfolioFit)}${metric("Risk Quality",c.riskQuality)}${metric("Execution",c.executionQuality)}${metric("Catalyst",c.catalyst)}</div>
 <div class="institutional-intelligence-narrative"><b>Institutional Case</b><p>${buildNarrative(score,consensus)}</p></div></section>`;
}
function buildNarrative(score,consensus){
 if(score.institutionalState==="EXECUTE")return `${score.symbol} meets institutional execution standards with strong component alignment and ${consensus?.passCount||0}/${consensus?.total||0} strategy consensus.`;
 if(score.institutionalState==="QUALIFIED")return `${score.symbol} is qualified, but requires final confirmation from risk, portfolio exposure, and execution readiness.`;
 if(score.institutionalState==="WATCH")return `${score.symbol} is near qualification. Continue monitoring for stronger confirmation before allocating capital.`;
 return `${score.symbol} does not currently satisfy institutional criteria. Preserve capital and wait.`;
}
window.EventBus?.subscribe?.("institutional-score.updated",renderInstitutionalIntelligencePanel);
window.EventBus?.subscribe?.("strategy-consensus.updated",renderInstitutionalIntelligencePanel);
window.EventBus?.subscribe?.("decision.updated",()=>setTimeout(renderInstitutionalIntelligencePanel,100));
document.addEventListener("DOMContentLoaded",()=>setTimeout(renderInstitutionalIntelligencePanel,1500));
window.InstitutionalIntelligencePanel={renderInstitutionalIntelligencePanel};
})();
