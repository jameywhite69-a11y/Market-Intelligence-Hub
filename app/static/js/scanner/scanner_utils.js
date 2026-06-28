function parseCsv(v){return v.split(',').map(x=>x.trim()).filter(Boolean)}
function resultKey(r){return `${r.symbol}:${r.timeframe}`}
function gradeOf(r){return r.tags?.[0]||''}
function confidenceOf(r){return r.tags?.[1]||''}
function statusOf(r){const s=Number(r.score??0);return s>=80?'Ready':s>=60?'Watch':'Avoid'}
function scoreClass(s){return s>=80?'score-high':s>=60?'score-medium':'score-low'}
window.scannerUtils={parseCsv,resultKey,gradeOf,confidenceOf,statusOf,scoreClass};
