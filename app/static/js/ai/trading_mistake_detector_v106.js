(function(){
const VERSION="106.0";

function detect(){
 const c=window.AITradeCoachV106?.coach?.()||{mistakes:[]};
 const analytics=window.InstitutionalAnalyticsEngineV105?.calc?.()||{};
 const rows=[...c.mistakes];

 if(Number(analytics.winRate||0)>70 && Number(analytics.profitFactor||0)<1.2) rows.push("High win rate with weak profit factor may indicate small wins and large losses.");
 if(Number(analytics.expectancy||0)<0) rows.push("Negative expectancy detected. Trading plan needs review.");
 if(Number(analytics.tradeCount||0)>10 && Number(analytics.sharpe||0)<0.25) rows.push("Low Sharpe ratio suggests returns are not compensating for volatility.");

 return rows;
}

function render(){
 const el=document.getElementById("tradingMistakeDetectorPanelV106");
 if(!el)return;
 const rows=detect();
 el.innerHTML=`<section class="v106-card"><div class="v106-header"><div><h2>Trading Mistake Detector</h2><span>behavioral and statistical warning flags</span></div><strong>${rows.length}</strong></div><div class="v106-list">${rows.map(r=>`<div><b>Flag</b><span>${r}</span></div>`).join("")||"<div><b>Clear</b><span>No major mistakes detected yet.</span></div>"}</div></section>`;
}

function wire(){
 window.EventBus?.subscribe?.("ai-trade-coach-v106.updated",render);
 setTimeout(render,1800);
}

window.TradingMistakeDetectorV106={detect,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
