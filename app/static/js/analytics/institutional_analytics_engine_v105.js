(function(){
const VERSION="105.0";

function data(){
 const attr=window.PortfolioAttributionEngineV93?.build?.()||{};
 const fills=window.ExecutionSimulatorV91?.snapshot?.()?.fills||[];
 const trades=window.PaperTradingAccountV80?.snapshot?.()?.trades||[];
 return {attr,fills,trades};
}
function calc(){
 const d=data(), attr=d.attr, trades=d.trades;
 const pnl=trades.map(t=>Number(t.pnl||0));
 const total=Number(attr.totalPnl||0);
 const wins=pnl.filter(x=>x>0), losses=pnl.filter(x=>x<0);
 const avg=pnl.length?pnl.reduce((a,b)=>a+b,0)/pnl.length:0;
 const sd=Math.sqrt(pnl.length?pnl.reduce((a,b)=>a+Math.pow(b-avg,2),0)/pnl.length:0);
 const downside=losses.length?Math.sqrt(losses.reduce((a,b)=>a+Math.pow(b,2),0)/losses.length):0;
 const grossWin=wins.reduce((a,b)=>a+b,0), grossLoss=Math.abs(losses.reduce((a,b)=>a+b,0));
 const sharpe=sd?avg/sd:0;
 const sortino=downside?avg/downside:0;
 const profitFactor=grossLoss?grossWin/grossLoss:(grossWin>0?999:0);
 const winRate=pnl.length?wins.length/pnl.length*100:0;
 const expectancy=pnl.length?avg:0;
 const maxDrawdown=Math.min(0,...pnl.reduce((arr,x,i)=>{const prev=i?arr[i-1]:0;arr.push(prev+x);return arr;},[]));
 const calmar=maxDrawdown?total/Math.abs(maxDrawdown):0;
 const kelly=profitFactor>0?Math.max(0,Math.min(1,(winRate/100)-((1-winRate/100)/profitFactor))):0;
 return {version:VERSION,total,tradeCount:pnl.length,winRate,profitFactor,sharpe,sortino,calmar,expectancy,maxDrawdown,kelly,avgTrade:avg,sd};
}
function render(){
 const el=document.getElementById("institutionalAnalyticsEnginePanelV105");
 if(!el)return;
 const m=calc();
 el.innerHTML=`<section class="v105-card"><div class="v105-header"><div><h2>Institutional Analytics Suite</h2><span>Sharpe · Sortino · Calmar · Profit Factor · Kelly · Expectancy</span></div><strong>${m.tradeCount} TRADES</strong></div><div class="v105-grid"><div><small>Sharpe</small><b>${m.sharpe.toFixed(2)}</b></div><div><small>Sortino</small><b>${m.sortino.toFixed(2)}</b></div><div><small>Calmar</small><b>${m.calmar.toFixed(2)}</b></div><div><small>Profit Factor</small><b>${m.profitFactor.toFixed(2)}</b></div><div><small>Kelly</small><b>${(m.kelly*100).toFixed(1)}%</b></div><div><small>Expectancy</small><b>$${m.expectancy.toFixed(2)}</b></div></div></section>`;
 window.EventBus?.publish?.("institutional-analytics-v105.updated",m);
}
function wire(){
 ["portfolio-attribution-v93.updated","execution-simulator-v91.updated","paper-trading-account.updated"].forEach(e=>window.EventBus?.subscribe?.(e,render));
 setTimeout(render,1600);
}
window.InstitutionalAnalyticsEngineV105={data,calc,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
