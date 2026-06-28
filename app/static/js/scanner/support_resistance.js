function renderSupportResistance(result) {
    const levels = chartIntelligence.chartLevels(result);
    return `<div class="support-resistance-card"><h3>Support / Resistance</h3>
        <div class="sr-row resistance"><span>Resistance 2</span><b>${levels.resistance2.toFixed(2)}</b></div>
        <div class="sr-row resistance"><span>Resistance 1</span><b>${levels.resistance1.toFixed(2)}</b></div>
        <div class="sr-row current"><span>Current</span><b>${levels.current.toFixed(2)}</b></div>
        <div class="sr-row support"><span>Support 1</span><b>${levels.support1.toFixed(2)}</b></div>
        <div class="sr-row support"><span>Support 2</span><b>${levels.support2.toFixed(2)}</b></div>
    </div>`;
}
window.supportResistance = { renderSupportResistance };
