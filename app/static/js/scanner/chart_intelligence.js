function chartLevels(result) {
    const score = Number(result.score ?? 70);
    const base = Math.max(20, score);
    const volatility = Math.max(1.5, (100 - score) / 12);
    const current = base;
    const entry = current + volatility * 0.35;
    const stop = current - volatility;
    const target1 = entry + (entry - stop) * 2;
    const target2 = entry + (entry - stop) * 4;
    return { current, entry, stop, target1, target2, support1: stop, support2: stop - volatility, resistance1: target1, resistance2: target2 };
}
function pct(level, min, max) { return 100 - ((level - min) / (max - min)) * 100; }
function chartLine(label, value, min, max, className) {
    return `<div class="chart-level ${className}" style="top:${pct(value,min,max)}%"><span>${label}</span><b>${value.toFixed(2)}</b></div>`;
}
function renderChartIntelligence(result) {
    const levels = chartLevels(result);
    const min = Math.min(levels.support2, levels.stop);
    const max = Math.max(levels.resistance2, levels.target2);
    return `<div class="chart-card-intel"><div class="chart-intel-header"><b>Visual Trade Map</b><span>${result.symbol} / ${result.timeframe}</span></div><div class="mini-chart">
        ${chartLine("Target 2", levels.target2, min, max, "target-line")}
        ${chartLine("Target 1", levels.target1, min, max, "target-line")}
        ${chartLine("Entry", levels.entry, min, max, "entry-line")}
        ${chartLine("Current", levels.current, min, max, "current-line")}
        ${chartLine("Stop", levels.stop, min, max, "stop-line")}
        ${chartLine("Support 2", levels.support2, min, max, "support-line")}
    </div></div>`;
}
window.chartIntelligence = { chartLevels, renderChartIntelligence };
