function numericValue(payload) { if (!payload || !payload.values) return null; const first = Object.values(payload.values).find((value) => typeof value === "number"); return typeof first === "number" ? first : null; }
function interpretIndicator(name, payload) {
    const value = numericValue(payload); const upperName = name.toUpperCase();
    if (value === null) return { name, value: "N/A", status: "Neutral", contribution: 0, note: "No numeric output available." };
    if (upperName.includes("EMA") || upperName.includes("SMA") || upperName.includes("VWMA")) return { name, value: value.toFixed(2), status: "Trend Input", contribution: 10, note: "Moving average contributes to trend confirmation." };
    if (upperName.includes("RSI")) {
        let status = "Neutral"; let contribution = 5;
        if (value >= 55 && value <= 75) { status = "Bullish Momentum"; contribution = 15; }
        else if (value > 75) { status = "Extended"; contribution = 3; }
        else if (value < 45) { status = "Weak Momentum"; contribution = -5; }
        return { name, value: value.toFixed(2), status, contribution, note: "RSI estimates momentum quality." };
    }
    return { name, value: value.toFixed(2), status: "Available", contribution: 5, note: "Indicator available for scoring context." };
}
function scoreComposition(result) {
    const score = Number(result.score ?? 0); const grade = scannerUtils.gradeOf(result); const confidence = scannerUtils.confidenceOf(result);
    return [
        { label: "Trend", value: Math.round(Math.min(35, Math.max(10, score * 0.35))) },
        { label: "Momentum", value: Math.round(Math.min(25, Math.max(5, score * 0.25))) },
        { label: "Volume / Confirmation", value: confidence === "High" ? 15 : confidence === "Medium" ? 10 : 5 },
        { label: "Setup Quality", value: grade === "A+" ? 15 : grade === "A" ? 12 : grade === "B" ? 8 : 4 },
        { label: "Risk Penalty", value: score >= 80 ? -3 : score >= 60 ? -8 : -15 },
    ];
}
function riskAssessment(result) {
    const score = Number(result.score ?? 0); const warnings = result.warnings || [];
    if (warnings.length >= 2 || score < 55) return { level: "High", className: "risk-high", summary: "Setup requires caution. Score or warnings indicate elevated risk." };
    if (score < 75 || warnings.length === 1) return { level: "Medium", className: "risk-medium", summary: "Setup is acceptable but should be confirmed before entry." };
    return { level: "Low", className: "risk-low", summary: "Setup quality is strong relative to current scanner inputs." };
}
function tradePlan(result) {
    const status = scannerUtils.statusOf(result);
    if (status === "Ready") return { action: "BUY / TRADEABLE", entry: "Enter on continuation above current setup trigger.", stop: "Below recent structure or key moving average.", target1: "Target 1: 2R", target2: "Target 2: 4R or trailing exit", management: "Move stop to breakeven after Target 1." };
    if (status === "Watch") return { action: "WATCH", entry: "Wait for confirmation.", stop: "Below invalidation level.", target1: "1.5R–2R after confirmation.", target2: "Trail if momentum expands.", management: "Do not enter until confirmation improves." };
    return { action: "AVOID", entry: "No entry suggested.", stop: "No stop required.", target1: "-", target2: "-", management: "Reassess after next scan." };
}
function timeframeConfirmation(result) {
    const current = result.timeframe || "Current"; const status = scannerUtils.statusOf(result);
    return [{ timeframe: "5m", status: status === "Ready" ? "Bullish" : "Mixed" }, { timeframe: current, status: status === "Avoid" ? "Weak" : "Aligned" }, { timeframe: "1h", status: status === "Ready" ? "Supportive" : "Neutral" }, { timeframe: "4h", status: "Context Pending" }, { timeframe: "Daily", status: "Context Pending" }];
}
function renderMeter(label, value, className = "") {
    const clamped = Math.max(0, Math.min(100, Number(value || 0)));
    return `<div class="explorer-meter ${className}"><div class="meter-label"><span>${label}</span><b>${clamped.toFixed(0)}%</b></div><div class="meter-track"><div class="meter-fill" style="width:${clamped}%"></div></div></div>`;
}
function renderOpportunityExplorer(result) {
    const score = Number(result.score ?? 0); const confidence = scannerUtils.confidenceOf(result); const risk = riskAssessment(result); const plan = tradePlan(result);
    const composition = scoreComposition(result); const timeframeRows = timeframeConfirmation(result); const interpretations = Object.entries(result.indicator_results || {}).map(([name, payload]) => interpretIndicator(name, payload));
    scannerDom.opportunityPanel.innerHTML = `
        <div class="explorer-header"><div><h2>${result.symbol}</h2><div class="inspector-subtitle">${result.timeframe}</div></div><span class="status-pill status-${scannerUtils.statusOf(result).toLowerCase()}">${plan.action}</span></div>
        ${window.chartIntelligence ? chartIntelligence.renderChartIntelligence(result) : ""}
        <div class="explorer-score-row"><div class="explorer-score ${scannerUtils.scoreClass(score)}">${score.toFixed(1)}</div><div><div class="inspector-badges"><span class="badge badge-grade">${scannerUtils.gradeOf(result)}</span><span class="badge badge-confidence">${confidence}</span><span class="risk-pill ${risk.className}">${risk.level} Risk</span></div><p class="muted">${risk.summary}</p></div></div>
        ${renderMeter("Score", score)}${renderMeter("Confidence", confidence === "High" ? 90 : confidence === "Medium" ? 65 : 40)}${renderMeter("Risk Control", risk.level === "Low" ? 85 : risk.level === "Medium" ? 55 : 25, risk.className)}
        ${window.trendGauge ? trendGauge.renderTrendGauge(result) : ""}${window.riskReward ? riskReward.renderRiskReward(result) : ""}${window.supportResistance ? supportResistance.renderSupportResistance(result) : ""}${window.tradeChecklist ? tradeChecklist.renderTradeChecklist(result) : ""}
        <h3>Score Composition</h3><div class="composition-list">${composition.map((item) => `<div class="composition-row"><span>${item.label}</span><b>${item.value > 0 ? "+" : ""}${item.value}</b></div>`).join("")}</div>
        <h3>Indicator Interpretation</h3><div class="indicator-interpretation">${interpretations.map((item) => `<div class="indicator-card"><div><b>${item.name}</b><span>${item.status}</span></div><strong>${item.value}</strong><small>${item.note}</small></div>`).join("") || "<p class='muted'>No indicator output available.</p>"}</div>
        <h3>Trade Plan</h3><div class="trade-plan"><div><b>Action</b><span>${plan.action}</span></div><div><b>Entry</b><span>${plan.entry}</span></div><div><b>Stop</b><span>${plan.stop}</span></div><div><b>Target 1</b><span>${plan.target1}</span></div><div><b>Target 2</b><span>${plan.target2}</span></div><div><b>Management</b><span>${plan.management}</span></div></div>
        <h3>Multi-Timeframe Confirmation</h3><table class="mtf-table"><tbody>${timeframeRows.map((row) => `<tr><td>${row.timeframe}</td><td>${row.status}</td></tr>`).join("")}</tbody></table>`;
}
window.opportunityExplorer = { renderOpportunityExplorer };
