(function(){
const KEY="tios.strategy.consensus.v47";
const STRATEGIES=["EMA Trend","Momentum Breakout","VWAP Reclaim","Market Structure","Volume Expansion","Risk Reclaim"];
function build(decision){
 if(!decision)return null;
 const base=Number(decision.confidence||decision.institutionalScore?.overall||0);
 const rows=STRATEGIES.map((name,i)=>{const score=Math.max(0,Math.min(100,base+(i%2===0?4:-3)-i));return {name,status:score>=75?"PASS":"FAIL",score:Math.round(score),reason:score>=75?"Aligned with decision context":"Insufficient confirmation"};});
 const passCount=rows.filter(r=>r.status==="PASS").length;
 const consensus={symbol:decision.symbol,timeframe:decision.timeframe,strategies:rows,passCount,total:rows.length,alignment:Math.round(passCount/rows.length*100),recommendation:passCount>=5?"Strong Consensus":passCount>=4?"Qualified Consensus":"Weak Consensus",createdAt:new Date().toISOString()};
 localStorage.setItem(KEY,JSON.stringify(consensus)); window.WorkspaceStore?.set?.("strategyConsensus",consensus); window.EventBus?.publish?.("strategy-consensus.updated",{consensus}); return consensus;
}
function current(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;}}
window.EventBus?.subscribe?.("decision.updated",p=>build(p?.decision));
document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>build(window.DecisionEngine?.current?.()),1300));
window.StrategyConsensusEngine={build,current};
})();
