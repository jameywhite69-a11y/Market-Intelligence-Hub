/*
Version 93.0 — Portfolio Analytics & Attribution Engine
Purpose:
- Builds a unified portfolio analytics model from paper account, V81 risk, V91 fills, and V84 journal.
- Paper/simulation only. No live broker execution.
*/
(function(){
const VERSION="93.0";
const KEY="mih.tios.portfolio.analytics.v93";

function safe(fn,fallback){try{return fn();}catch{return fallback;}}
function paper(){return safe(()=>window.PaperTradingAccountV80.snapshot(),{positions:[],orders:[],trades:[],equity:100000,cash:100000})||{};}
function risk(){return safe(()=>window.PositionRiskManagerV81.analyze(),{positions:[],riskPct:0,totalUnrealized:0,avgR:0,status:"Waiting"})||{};}
function fills(){return safe(()=>window.ExecutionSimulatorV91.snapshot().fills,[])||[];}
function journal(){return safe(()=>window.PaperTradeJournalV84.buildEntries(),[])||[];}

function classify(symbol){
    const s=String(symbol||"").toUpperCase();
    if(["BTC","ETH","SOL","LINK","AVAX","AAVE"].some(x=>s.includes(x)))return "Crypto";
    if(["SPY","QQQ","AAPL","MSFT","NVDA","TSLA"].some(x=>s.includes(x)))return "Equities";
    if(["ES","NQ","YM","RTY","CL","GC"].some(x=>s.includes(x)))return "Futures";
    return "Other";
}

function build(){
    const acct=paper();
    const r=risk();
    const f=fills();
    const trades=acct.trades||[];
    const positions=(acct.positions||[]).filter(p=>p.status==="OPEN");
    const equity=Number(acct.equity||100000);
    const cash=Number(acct.cash||0);
    const realized=trades.reduce((a,t)=>a+Number(t.pnl||0),0);
    const unrealized=Number(r.totalUnrealized||0);
    const totalPnl=realized+unrealized;
    const wins=trades.filter(t=>Number(t.pnl||0)>0).length;
    const losses=trades.filter(t=>Number(t.pnl||0)<0).length;
    const winRate=trades.length?(wins/trades.length)*100:0;
    const avgR=trades.length?trades.reduce((a,t)=>a+Number(t.r||0),0)/trades.length:Number(r.avgR||0);
    const exposure=positions.reduce((a,p)=>a+Math.abs(Number(p.mark||p.entry||0)*Number(p.qty||0)),0);
    const exposurePct=equity?exposure/equity*100:0;

    const buckets={};
    positions.forEach(p=>{
        const bucket=classify(p.symbol);
        buckets[bucket]=buckets[bucket]||{notional:0,count:0,unrealized:0};
        buckets[bucket].notional+=Math.abs(Number(p.mark||p.entry||0)*Number(p.qty||0));
        buckets[bucket].count+=1;
        buckets[bucket].unrealized+=Number(p.unrealizedPnl||0);
    });

    const fillStats={
        fills:f.length,
        avgLatency:f.length?f.reduce((a,x)=>a+Number(x.latencyMs||0),0)/f.length:0,
        avgSlippage:f.length?f.reduce((a,x)=>a+Number(x.slippageBps||0),0)/f.length:0,
        partials:f.filter(x=>x.status==="PARTIALLY_FILLED").length
    };

    const model={
        version:VERSION,
        timestamp:new Date().toISOString(),
        equity,cash,realized,unrealized,totalPnl,
        trades:trades.length,wins,losses,winRate,avgR,
        openPositions:positions.length,
        exposure,exposurePct,
        riskPct:Number(r.riskPct||0),
        riskStatus:r.status||"Waiting",
        buckets,
        fillStats,
        journalEntries:journal().length,
        grade: totalPnl>0 && Number(r.riskPct||0)<2 ? "Constructive" : Number(r.riskPct||0)>=2 ? "Risk Elevated" : "Neutral"
    };

    try{localStorage.setItem(KEY,JSON.stringify(model));}catch{}
    return model;
}

function render(){
    const panel=document.getElementById("portfolioAttributionEnginePanelV93");
    if(!panel)return;
    const m=build();
    panel.innerHTML=`<section class="v93-card"><div class="v93-header"><div><h2>Portfolio Analytics & Attribution</h2><span>paper P/L · exposure · execution quality · risk attribution</span></div><strong>${m.grade}</strong></div><div class="v93-grid"><div><small>Equity</small><b>$${m.equity.toFixed(2)}</b></div><div><small>Total P/L</small><b>$${m.totalPnl.toFixed(2)}</b></div><div><small>Win Rate</small><b>${m.winRate.toFixed(1)}%</b></div><div><small>Avg R</small><b>${m.avgR.toFixed(2)}R</b></div><div><small>Exposure</small><b>${m.exposurePct.toFixed(1)}%</b></div><div><small>Risk</small><b>${m.riskPct.toFixed(2)}%</b></div></div></section>`;
    window.EventBus?.publish?.("portfolio-attribution-v93.updated",m);
}

function wire(){
    ["paper-trading-account.updated","position-risk-v81.updated","execution-simulator-v91.updated","oms-v88.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
    setTimeout(render,1800);
}

window.PortfolioAttributionEngineV93={build,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
