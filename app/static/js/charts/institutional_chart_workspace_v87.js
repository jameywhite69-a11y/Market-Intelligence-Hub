(function(){
const VERSION="87.0";
const STATE={activeSymbol:"BTC",timeframe:"1m",linked:true};
function stream(){return window.StreamingMarketDataBusV85?.snapshot?.()||{candles:{},quotes:{}};}
function symbols(){const s=stream();const q=Object.keys(s.quotes||{});return q.length?q:["BTC","ETH","SOL","LINK","AVAX"];}
function series(symbol){return (stream().candles||{})[symbol]||[];}
function setSymbol(symbol){STATE.activeSymbol=symbol||STATE.activeSymbol;window.EventBus?.publish?.("chart-workspace-v87.symbol-changed",{symbol:STATE.activeSymbol});render();}
function setTimeframe(tf){STATE.timeframe=tf||STATE.timeframe;render();}
function line(symbol){const c=series(symbol).slice(-60);if(!c.length)return"";const vals=c.map(x=>Number(x.close||0));const min=Math.min(...vals);const max=Math.max(...vals);const r=Math.max(.01,max-min);return vals.map((v,i)=>`${vals.length===1?0:((i/(vals.length-1))*100).toFixed(2)},${(100-((v-min)/r)*90-5).toFixed(2)}`).join(" ");}
function chart(symbol,large){
 const s=stream();const q=s.quotes?.[symbol]||{};const c=series(symbol);const last=c[c.length-1]||{};
 return `<div class="v87-chart ${large?"large":""}" data-symbol="${symbol}"><div class="v87-chart-head"><b>${symbol}</b><span>${Number(q.price||last.close||0).toFixed(2)}</span><em>${Number(q.changePct||0).toFixed(2)}%</em></div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${line(symbol)}" fill="none" stroke="currentColor" stroke-width="2"/></svg><div class="v87-chart-foot"><span>${c.length} candles</span><span>${q.source||s.adapter||"stream"}</span></div></div>`;
}
function render(){
 const panel=document.getElementById("institutionalChartWorkspacePanelV87"); if(!panel)return;
 const list=symbols(); if(!list.includes(STATE.activeSymbol))STATE.activeSymbol=list[0]||"BTC";
 panel.innerHTML=`<section class="v87-card"><div class="v87-header"><div><h2>Institutional Chart Workspace</h2><span>streaming candles · linked symbols · paper-trading view</span></div><strong>${STATE.activeSymbol} ${STATE.timeframe}</strong></div><div class="v87-toolbar">${list.slice(0,10).map(sym=>`<button class="${sym===STATE.activeSymbol?"active":""}" data-symbol="${sym}">${sym}</button>`).join("")}<button data-tf="1m" class="${STATE.timeframe==="1m"?"active":""}">1m</button><button data-tf="5m" class="${STATE.timeframe==="5m"?"active":""}">5m</button><button data-tf="15m" class="${STATE.timeframe==="15m"?"active":""}">15m</button></div><div class="v87-chart-grid">${chart(STATE.activeSymbol,true)}${list.filter(s=>s!==STATE.activeSymbol).slice(0,3).map(s=>chart(s,false)).join("")}</div></section>`;
 panel.querySelectorAll("[data-symbol]").forEach(b=>b.addEventListener("click",()=>setSymbol(b.dataset.symbol)));
 panel.querySelectorAll("[data-tf]").forEach(b=>b.addEventListener("click",()=>setTimeframe(b.dataset.tf)));
}
function wire(){window.EventBus?.subscribe?.("streaming-market-data.updated",render);window.EventBus?.subscribe?.("scanner.selection.changed",p=>{const sym=p?.symbol||p?.value?.symbol;if(STATE.linked&&sym)setSymbol(sym);});setTimeout(render,1600);}
window.InstitutionalChartWorkspaceV87={setSymbol,setTimeframe,render,state:()=>({...STATE}),version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
