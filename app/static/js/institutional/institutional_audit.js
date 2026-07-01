(function(){
function audit(payload={}){
 const score=payload.score||window.InstitutionalScoringEngine?.current?.(); if(!score)return;
 window.ActivityTimelineStore?.addEvent?.("institutional-intelligence.updated",{symbol:score.symbol,timeframe:score.timeframe,detail:`${score.institutionalState} · ${score.overall}`,score},"institutional-intelligence");
 window.GlobalEventRecorder?.record?.("institutional-intelligence.updated",{symbol:score.symbol,detail:`${score.institutionalState} · ${score.overall}`,score},"institutional-intelligence");
}
window.EventBus?.subscribe?.("institutional-score.updated",audit);
window.InstitutionalAudit={audit};
})();
