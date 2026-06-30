async function loadStrategyRegistry() {
    const [list, health] = await Promise.all([window.strategyRegistryClient.list(), window.strategyRegistryClient.health()]);
    window.WorkspaceStore?.set?.("strategyRegistry", list);
    window.WorkspaceStore?.set?.("strategyRegistryHealth", health);
    window.EventBus?.publish?.("strategy-registry.updated", { list, health });
    return { list, health };
}
function gradeFor(score) {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
}
function renderStrategyRegistryPanel(data = {}) {
    const panel = document.getElementById("strategyRegistryPanel");
    if (!panel) return;
    const list = data.list || window.WorkspaceStore?.get?.("strategyRegistry") || { strategies: [] };
    const health = data.health || window.WorkspaceStore?.get?.("strategyRegistryHealth") || {};
    const strategies = list.strategies || [];
    panel.innerHTML = `
        <section class="strategy-registry-card">
            <div class="terminal-card-header"><h3>Strategy Registry</h3><span>${strategies.length} strategies</span></div>
            <div class="strategy-registry-summary">
                <div><b>Avg Health</b><span>${Number(health.average_health || 0).toFixed(1)}</span></div>
                <div><b>Deployable</b><span>${health.deployable_count || 0}</span></div>
                <div><b>Top Strategy</b><span>${health.top_strategy?.name || "—"}</span></div>
                <div><b>Alpha 2</b><span>Research</span></div>
            </div>
            <div class="strategy-registry-list">
                ${strategies.map(strategy => `
                    <div class="strategy-registry-row" data-strategy-id="${strategy.strategy_id}">
                        <div class="strategy-title"><b>${strategy.name}</b><span>${strategy.lifecycle} · ${strategy.deployment_status}</span></div>
                        <strong>${gradeFor(Number(strategy.health_score || 0))}</strong>
                        <div class="strategy-metrics">
                            <span>PF ${Number(strategy.profit_factor || 0).toFixed(2)}</span>
                            <span>WR ${Number(strategy.win_rate || 0).toFixed(1)}%</span>
                            <span>EXP ${Number(strategy.expectancy_r || 0).toFixed(2)}R</span>
                            <span>DD ${Number(strategy.max_drawdown_percent || 0).toFixed(1)}%</span>
                        </div>
                        <p>${strategy.description || ""}</p>
                    </div>`).join("") || `<p class="muted">No strategies registered.</p>`}
            </div>
        </section>`;
    for (const row of panel.querySelectorAll("[data-strategy-id]")) {
        row.addEventListener("click", () => {
            const strategy = strategies.find(item => item.strategy_id === row.dataset.strategyId);
            window.WorkspaceContext?.setStrategy?.(strategy?.strategy_id || row.dataset.strategyId);
            window.EventBus?.publish?.("strategy-registry.selected", { strategy });
        });
    }
}
async function refreshStrategyRegistryPanel() {
    const panel = document.getElementById("strategyRegistryPanel");
    if (!panel) return;
    try { renderStrategyRegistryPanel(await loadStrategyRegistry()); }
    catch (error) {
        panel.innerHTML = `<p class="muted">Strategy Registry unavailable: ${error.message}</p>`;
        window.WorkspaceStore?.pushError?.(error, "strategy-registry");
    }
}
window.EventBus?.subscribe?.("strategy-registry.updated", renderStrategyRegistryPanel);
window.EventBus?.subscribe?.("workspace.context.changed", renderStrategyRegistryPanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(refreshStrategyRegistryPanel, 700));
window.StrategyRegistryPanel = { refreshStrategyRegistryPanel, renderStrategyRegistryPanel };
