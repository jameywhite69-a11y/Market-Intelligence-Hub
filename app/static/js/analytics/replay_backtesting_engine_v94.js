/*
Version 94.0 — Professional Replay & Backtesting Engine
Purpose:
- Replays V85 candle streams and V93 attribution snapshots in a controlled paper-safe simulation.
- Drives EventBus replay events for scanner/AI/OMS testing without live broker execution.
*/
(function(){
const VERSION="94.0";
const KEY="mih.tios.replay.v94";

const DEFAULT_STATE={running:false,speed:1,index:0,symbol:null,events:[],lastReplay:null};

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));publish();render();return s;}
function stream(){return window.StreamingMarketDataBusV85?.snapshot?.()||{candles:{},quotes:{}};}
function symbols(){return Object.keys(stream().candles||{});}
function series(symbol){const snap=stream();const list=(snap.candles||{})[symbol]||[];return list.slice();}
function log(s,message,data){s.events.unshift({time:new Date().toLocaleTimeString(),message,data:data||{}});s.events=s.events.slice(0,150);}

function start(symbol){
 const s=load();
 const list=symbols();
 s.symbol=symbol||s.symbol||list[0]||"BTC";
 s.running=true;
 s.index=0;
 log(s,`Replay started for ${s.symbol}`,{symbol:s.symbol});
 save(s);
 tick();
 return s;
}
function stop(){
 const s=load();
 s.running=false;
 log(s,"Replay stopped");
 return save(s);
}
function reset(){
 localStorage.removeItem(KEY);
 render();
 publish();
}
function setSpeed(speed){
 const s=load();
 s.speed=Math.max(0.25,Math.min(10,Number(speed||1)));
 log(s,`Replay speed set to ${s.speed}x`);
 return save(s);
}
function tick(){
 const s=load();
 if(!s.running)return null;
 const candles=series(s.symbol);
 if(!candles.length){
  s.running=false;log(s,`No candles available for ${s.symbol}`);save(s);return null;
 }
 const candle=candles[Math.min(s.index,candles.length-1)];
 const replay={version:VERSION,symbol:s.symbol,index:s.index,total:candles.length,candle,timestamp:new Date().toISOString(),speed:s.speed};
 s.lastReplay=replay;
 s.index+=1;
 if(s.index>=candles.length){s.running=false;log(s,`Replay completed for ${s.symbol}`,replay);}
 save(s);
 window.EventBus?.publish?.("replay-backtest-v94.tick",replay);
 window.EventBus?.publish?.("realtime-data.updated",{version:VERSION,quotes:{[s.symbol]:{symbol:s.symbol,price:Number(candle.close||0),changePct:0,volume:Number(candle.volume||0),source:"replay-v94",timestamp:replay.timestamp}},reason:"replay-v94"});
 if(s.running)setTimeout(tick,Math.max(100,1000/Number(s.speed||1)));
 return replay;
}
function runFast(symbol){
 const s=load();
 const sym=symbol||s.symbol||symbols()[0]||"BTC";
 const candles=series(sym);
 const results=[];
 candles.forEach((c,i)=>{
  const replay={version:VERSION,symbol:sym,index:i,total:candles.length,candle:c,timestamp:new Date().toISOString(),speed:"fast"};
  results.push(replay);
 });
 s.symbol=sym;s.running=false;s.index=candles.length;s.lastReplay=results[results.length-1]||null;
 log(s,`Fast replay completed for ${sym}`,{bars:results.length});
 save(s);
 window.EventBus?.publish?.("replay-backtest-v94.completed",{version:VERSION,symbol:sym,bars:results.length,results});
 return results;
}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("replay-backtest-v94.updated",{version:VERSION,state:snapshot()});}

function render(){
 const panel=document.getElementById("replayBacktestingEnginePanelV94");
 if(!panel)return;
 const s=snapshot(), list=symbols();
 panel.innerHTML=`<section class="v94-card"><div class="v94-header"><div><h2>Professional Replay & Backtesting Engine</h2><span>paper-safe candle replay · EventBus simulation · strategy validation</span></div><strong>${s.running?"RUNNING":"IDLE"}</strong></div><div class="v94-grid"><div><small>Symbol</small><b>${s.symbol||list[0]||"—"}</b></div><div><small>Index</small><b>${s.index}</b></div><div><small>Speed</small><b>${s.speed}x</b></div><div><small>Symbols</small><b>${list.length}</b></div><div><small>Events</small><b>${s.events.length}</b></div><div><small>Mode</small><b>PAPER</b></div></div><div class="v94-actions">${list.slice(0,8).map(sym=>`<button data-symbol="${sym}" class="${sym===s.symbol?"active":""}">${sym}</button>`).join("")}<button id="v94StartReplay">Start</button><button id="v94StopReplay">Stop</button><button id="v94FastReplay">Fast Replay</button><button id="v94ResetReplay">Reset</button></div></section>`;
 panel.querySelectorAll("[data-symbol]").forEach(btn=>btn.addEventListener("click",()=>{const st=load();st.symbol=btn.dataset.symbol;save(st);}));
 document.getElementById("v94StartReplay")?.addEventListener("click",()=>start());
 document.getElementById("v94StopReplay")?.addEventListener("click",stop);
 document.getElementById("v94FastReplay")?.addEventListener("click",()=>runFast());
 document.getElementById("v94ResetReplay")?.addEventListener("click",reset);
}
function wire(){
 window.EventBus?.subscribe?.("streaming-market-data.updated",render);
 setTimeout(render,1800);
}
window.ReplayBacktestingEngineV94={start,stop,reset,setSpeed,tick,runFast,snapshot,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
