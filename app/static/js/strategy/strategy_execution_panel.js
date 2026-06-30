async function buildStrategyPlanFromCurrentContext() {
    const context = window.TradeContext?.getCurrent?.();
    if (!context) return null;
    const opportunity = context.raw || {symbol: context.symbol, timeframe: context.timeframe, score: context.score};
    return await window.strategyExecutionClient.plan(opportunity);
}

function renderStrategyExecutionResult(payload) {
    const panel = document.getElementById("strategyExecutionPanel");
    if (!panel) return;

    if (!payload) {
        panel.innerHTML = `
            <section class="strategy-execution-card">
                <div class="terminal-card-header">
                    <h3>Strategy Execution</h3>
                    <span>No selection</span>
                </div>
                <p class="muted">Select an opportunity to generate an execution plan.</p>
            </section>`;
        return;
    }

    const signal = payload.signal;
    const plan = payload.plan;

    panel.innerHTML = `
        <section class="strategy-execution-card">
            <div class="terminal-card-header">
                <h3>Strategy Execution</h3>
                <span>${plan.status}</span>
            </div>
            <div class="strategy-plan-grid">
                <div><b>Strategy</b><span>${plan.strategy_id}</span></div>
                <div><b>Action</b><span>${signal.action.toUpperCase()}</span></div>
                <div><b>Symbol</b><span>${plan.symbol}</span></div>
                <div><b>Qty</b><span>${Number(plan.quantity).toFixed(4)}</span></div>
                <div><b>Risk</b><span>$${Number(plan.dollar_risk).toFixed(2)}</span></div>
                <div><b>Expected R</b><span>${Number(plan.expected_r).toFixed(2)}R</span></div>
            </div>
            <div class="strategy-rationale">
                ${(plan.rationale || []).map(item => `<p>${item}</p>`).join("")}
                ${(plan.rejection_reasons || []).map(item => `<p class="rejection">${item}</p>`).join("")}
            </div>
            <button id="executeStrategyPlanButton" ${plan.status !== "approved" ? "disabled" : ""}>Execute Paper Plan</button>
        </section>`;

    document.getElementById("executeStrategyPlanButton")?.addEventListener("click", async () => {
        const result = await window.strategyExecutionClient.execute(plan);
        window.EventBus?.publish?.("strategy:executed", result);
        window.EventBus?.publish?.("paper-order-filled", result);
        document.dispatchEvent(new CustomEvent("paper-trade-updated"));
        await renderStrategyExecutionPanel();
    });
}

async function renderStrategyExecutionPanel() {
    const panel = document.getElementById("strategyExecutionPanel");
    if (!panel) return;
    try {
        renderStrategyExecutionResult(await buildStrategyPlanFromCurrentContext());
    } catch (error) {
        panel.innerHTML = `<p class="muted">Strategy execution unavailable: ${error.message}</p>`;
    }
}

window.EventBus?.subscribe?.("trade-selected", renderStrategyExecutionPanel);
window.EventBus?.subscribe?.("scan:completed", renderStrategyExecutionPanel);
document.addEventListener("paper-trade-updated", renderStrategyExecutionPanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(renderStrategyExecutionPanel, 250));

window.StrategyExecutionPanel = {renderStrategyExecutionPanel};
