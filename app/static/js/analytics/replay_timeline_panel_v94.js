(function(){
const VERSION="94.0";
function render(payload){
 const panel=document.getElementById("replayTimelinePanelV94");
 if(!panel)return;
 const s=payload?.state||window.ReplayBacktestingEngineV94?.snapshot?.()||{events:[]};
 const rows=(s.events||[]).slice(0,12);
 panel.innerHTML=`<section class="v94-card"><div class="v94-header"><div><h2>Replay Timeline</h2><span>replay/backtest event log</span></div><strong>${rows.length}</strong></div><div class="v94-list">${rows.map(e=>`<div><b>${e.time}</b><span>${e.message}</span><em>${e.data?.symbol||""}</em></div>`).join("")||"<div class='v94-empty'>No replay events yet.</div>"}</div></section>`;
}
function wire(){window.EventBus?.subscribe?.("replay-backtest-v94.updated",render);setTimeout(()=>render(),2000);}
window.ReplayTimelinePanelV94={render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1200));
})();
