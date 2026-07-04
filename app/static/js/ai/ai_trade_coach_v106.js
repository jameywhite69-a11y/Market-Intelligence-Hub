(function(){
const VERSION="106.0";

function data(){
 const analytics=window.InstitutionalAnalyticsEngineV105?.calc?.()||{};
 const journal=window.PaperTradeJournalV84?.buildEntries?.()||[];
 const attribution=window.PortfolioAttributionEngineV93?.build?.()||{};
 const fills=window.ExecutionSimulatorV91?.snapshot?.()?.fills||[];
 return {analytics,journal,attribution,fills};
}

function coach(){
 const d=data(), a=d.analytics, attr=d.attribution;
 const notes=[];
 if(Number(a.tradeCount||0)===0) notes.push("Build a larger paper-trading sample before trusting performance statistics.");
 if(Number(a.winRate||0)<45 && Number(a.tradeCount||0)>5) notes.push("Win rate is weak. Tighten entry filters or require stronger confirmation.");
 if(Number(a.profitFactor||0)<1 && Number(a.tradeCount||0)>5) notes.push("Profit factor is below 1. Review exits, stop placement, and trade selection.");
 if(Number(a.sharpe||0)<0 && Number(a.tradeCount||0)>5) notes.push("Risk-adjusted returns are negative. Reduce size until the edge improves.");
 if(Number(attr.riskPct||0)>2) notes.push("Portfolio risk is elevated. Reduce exposure or cut weaker positions.");
 if((d.fills||[]).filter(f=>f.status==="PARTIALLY_FILLED").length>3) notes.push("Frequent partial fills detected. Review order type, liquidity, and execution assumptions.");
 if(!notes.length) notes.push("Current paper workflow is stable. Continue collecting trades and avoid increasing size too quickly.");

 const mistakes=[];
 if(Number(a.maxDrawdown||0)<-500) mistakes.push("Drawdown pressure detected.");
 if(Number(a.kelly||0)>0.25) mistakes.push("Kelly estimate is aggressive; consider fractional Kelly only.");
 if(Number(a.tradeCount||0)<20) mistakes.push("Sample size is too small for strong conclusions.");

 return {version:VERSION,timestamp:new Date().toISOString(),notes,mistakes,grade:notes.length<=2?"Constructive":"Review"};
}

function render(){
 const el=document.getElementById("aiTradeCoachPanelV106");
 if(!el)return;
 const c=coach();
 el.innerHTML=`<section class="v106-card"><div class="v106-header"><div><h2>Advanced AI Trade Coach</h2><span>journal review · mistake detection · performance coaching</span></div><strong>${c.grade}</strong></div><div class="v106-list">${c.notes.map(n=>`<div><b>Coach</b><span>${n}</span></div>`).join("")}</div></section>`;
 window.EventBus?.publish?.("ai-trade-coach-v106.updated",c);
}

function wire(){
 ["institutional-analytics-v105.updated","portfolio-attribution-v93.updated","execution-simulator-v91.updated","paper-trading-account.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,1600);
}

window.AITradeCoachV106={data,coach,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
