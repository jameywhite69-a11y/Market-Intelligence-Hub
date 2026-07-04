(function(){
const VERSION="104.0",KEY="mih.tios.multi.account.registry.v104";
const DEFAULT=[{id:"paper-main",name:"Paper Main",type:"paper",broker:"Paper",equity:100000,cash:75000,buyingPower:150000,openPnl:0,dailyPnl:0,riskPct:0,status:"connected"},{id:"coinbase-sim",name:"Coinbase Sim",type:"sim",broker:"Coinbase",equity:50000,cash:50000,buyingPower:50000,openPnl:0,dailyPnl:0,riskPct:0,status:"planned"},{id:"ibkr-sim",name:"IBKR Sim",type:"sim",broker:"IBKR",equity:100000,cash:100000,buyingPower:200000,openPnl:0,dailyPnl:0,riskPct:0,status:"planned"}];
function load(){try{return JSON.parse(localStorage.getItem(KEY))||DEFAULT;}catch{return DEFAULT;}}
function save(a){localStorage.setItem(KEY,JSON.stringify(a));publish();render();return a;}
function syncPaper(){const a=load(),acct=window.PaperTradingAccountV80?.snapshot?.();if(acct){const p=a.find(x=>x.id==="paper-main");if(p){p.equity=Number(acct.equity||p.equity);p.cash=Number(acct.cash||p.cash);p.buyingPower=Number(acct.buyingPower||p.buyingPower);}}return save(a);}
function addAccount(account){const a=load();a.push({id:`acct-${Date.now()}`,status:"planned",equity:0,cash:0,buyingPower:0,openPnl:0,dailyPnl:0,riskPct:0,...account});return save(a);}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("multi-account-registry-v104.updated",{version:VERSION,accounts:snapshot()});}
function render(){const el=document.getElementById("multiAccountRegistryPanelV104");if(!el)return;const a=snapshot();el.innerHTML=`<section class="v104-card"><div class="v104-header"><div><h2>Multi-Account Registry</h2><span>paper, sim, and future broker account inventory</span></div><strong>${a.length}</strong></div><div class="v104-list">${a.map(x=>`<div><b>${x.name}</b><span>${x.broker} · ${x.type}</span><em>${x.status}</em></div>`).join("")}</div></section>`;}
function wire(){window.EventBus?.subscribe?.("paper-trading-account.updated",syncPaper);setTimeout(()=>{syncPaper();render();},1200);}
window.MultiAccountRegistryV104={snapshot,addAccount,syncPaper,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
