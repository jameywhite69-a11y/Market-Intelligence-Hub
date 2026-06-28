function checklistItems(result) {
    const score = Number(result.score ?? 0);
    const confidence = scannerUtils.confidenceOf(result);
    const status = scannerUtils.statusOf(result);
    const warnings = result.warnings || [];
    return [
        { label: "Scanner score above 80", pass: score >= 80 },
        { label: "Confidence is medium or high", pass: confidence !== "Low" },
        { label: "Setup status is not Avoid", pass: status !== "Avoid" },
        { label: "No critical warnings", pass: warnings.length === 0 },
        { label: "Trade plan available", pass: true },
    ];
}
function renderTradeChecklist(result) {
    return `<div class="trade-checklist-card"><h3>Trade Checklist</h3>${checklistItems(result).map((item) => `<div class="checklist-row ${item.pass ? "check-pass" : "check-warn"}"><span>${item.pass ? "✓" : "⚠"}</span><b>${item.label}</b></div>`).join("")}</div>`;
}
window.tradeChecklist = { checklistItems, renderTradeChecklist };
