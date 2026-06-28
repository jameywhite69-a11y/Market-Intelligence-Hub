function trendStrength(result) {
    const score = Number(result.score ?? 0);
    const confidence = scannerUtils.confidenceOf(result);
    const confidenceBonus = confidence === "High" ? 10 : confidence === "Medium" ? 5 : 0;
    return Math.max(0, Math.min(100, score * 0.75 + confidenceBonus));
}
function renderTrendGauge(result) {
    const strength = trendStrength(result);
    const label = strength >= 75 ? "Strong" : strength >= 55 ? "Moderate" : "Weak";
    return `<div class="trend-gauge-card"><h3>Trend Strength</h3><div class="trend-gauge-value">${strength.toFixed(0)}%</div><div class="trend-gauge-track"><div class="trend-gauge-fill" style="width:${strength}%"></div></div><div class="trend-gauge-label">${label}</div></div>`;
}
window.trendGauge = { trendStrength, renderTrendGauge };
