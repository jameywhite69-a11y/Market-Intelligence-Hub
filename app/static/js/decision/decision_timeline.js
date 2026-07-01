(function(){
function logDecision(payload={}){
 const d=payload.decision; if(!d)return;
 window.ActivityTimelineStore?.addEvent?.("decision.updated",{symbol:d.symbol,timeframe:d.timeframe,detail:`${d.recommendation} · ${d.institutionalScore?.overall||0}`,decision:d},"decision-engine");
 window.GlobalEventRecorder?.record?.("decision.updated",{symbol:d.symbol,detail:d.recommendation,decision:d},"decision-engine");
}
window.EventBus?.subscribe?.("decision.updated",logDecision);
window.DecisionTimeline={logDecision};
})();
