(function(){
const VERSION="104.0";
function build(){const paper=window.PaperTradingAccountV80?.snapshot?.()?.positions||[],rows={};paper.filter(p=>p.status==="OPEN").forEach(p=>{const sym=p.symbol||"—";rows[sym]=rows[sym]||{symbol:sym,accounts:[],qty:0,pnl:0};rows[sym].accounts.push("Paper Main");rows[sym].qty+=Number(p.qty||0);rows[sym].pnl+=Number(p.unrealizedPnl||0);});return Object.values(rows);}
function render(){const el=document.getElementById("crossAccountPositionsPanelV104");if(!el)return;const rows=build();el.innerHTML=`<section class="v104-card"><div class="v104-header"><div><h2>Cross-Account Positions</h2><span>combined symbol exposure across accounts</span></div><strong>${rows.length}</strong></div><div class="v104-list">${rows.map(r=>`<div><b>${r.symbol}</b><span>${r.accounts.join(", ")} · qty ${r.qty}</span><em>$${r.pnl.toFixed(2)}</em></div>`).join("")||"<div class='v104-empty'>No open cross-account positions.</div>"}</div></section>`;}
function wire(){window.EventBus?.subscribe?.("paper-trading-account.updated",render);setTimeout(render,1700);}
window.CrossAccountPositionsV104={build,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1300));
})();
