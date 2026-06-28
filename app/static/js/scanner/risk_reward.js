function calculateRiskReward(result) {
    const levels = chartIntelligence.chartLevels(result);
    const risk = Math.max(0.01, levels.entry - levels.stop);
    const reward1 = Math.max(0.01, levels.target1 - levels.entry);
    const reward2 = Math.max(0.01, levels.target2 - levels.entry);
    return { risk, reward1, reward2, rr1: reward1 / risk, rr2: reward2 / risk };
}
function renderRiskReward(result) {
    const rr = calculateRiskReward(result);
    return `<div class="risk-reward-card"><h3>Risk / Reward</h3><div class="rr-grid">
        <div><b>Risk</b><span>${rr.risk.toFixed(2)}</span></div>
        <div><b>Reward 1</b><span>${rr.reward1.toFixed(2)}</span></div>
        <div><b>Reward 2</b><span>${rr.reward2.toFixed(2)}</span></div>
        <div><b>R:R 1</b><span>${rr.rr1.toFixed(2)}</span></div>
        <div><b>R:R 2</b><span>${rr.rr2.toFixed(2)}</span></div>
    </div></div>`;
}
window.riskReward = { calculateRiskReward, renderRiskReward };
