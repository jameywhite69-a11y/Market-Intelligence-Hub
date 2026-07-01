(function(){
const KEY="tios.opportunity.ranking.v47";
function rankCurrent(){
 const score=window.InstitutionalScoringEngine?.current?.(), consensus=window.StrategyConsensusEngine?.current?.();
 if(!score)return null;
 const ranking={symbol:score.symbol,timeframe:score.timeframe,institutionalScore:score.overall,consensusAlignment:consensus?.alignment||0,expectedR:Number(score.decision?.opportunity?.expectedR||0),capitalPriority:score.overall>=90?"High":score.overall>=80?"Medium":"Low",rankScore:Math.round((score.overall*.7+(consensus?.alignment||0)*.3)*10)/10,createdAt:new Date().toISOString()};
 localStorage.setItem(KEY,JSON.stringify(ranking)); window.WorkspaceStore?.set?.("opportunityRanking",ranking); window.EventBus?.publish?.("opportunity-ranking.updated",{ranking}); return ranking;
}
function current(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;}}
window.EventBus?.subscribe?.("institutional-score.updated",()=>setTimeout(rankCurrent,50));
window.EventBus?.subscribe?.("strategy-consensus.updated",()=>setTimeout(rankCurrent,50));
window.OpportunityRankingEngine={rankCurrent,current};
})();
