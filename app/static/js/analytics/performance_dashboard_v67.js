/*
Version 67.0 — Performance Dashboard
*/
(function () {
    const VERSION = "67.0";

    function render(metrics) {
        const panel = document.getElementById("performanceDashboardV67Panel");
        if (!panel || !metrics) return;

        panel.innerHTML = `
            <section class="v67-card">
                <div class="v67-header">
                    <div>
                        <h2>Portfolio Performance Analytics</h2>
                        <span>${metrics.totalTrades} paper trades · ${metrics.reason || "metrics"}</span>
                    </div>
                    <strong>$${metrics.totalPnl.toFixed(2)}</strong>
                </div>

                <div class="v67-grid">
                    <div><small>Win Rate</small><b>${metrics.winRate.toFixed(1)}%</b></div>
                    <div><small>Profit Factor</small><b>${metrics.profitFactor.toFixed(2)}</b></div>
                    <div><small>Avg R</small><b>${metrics.avgR.toFixed(2)}R</b></div>
                    <div><small>Expectancy</small><b>$${metrics.expectancy.toFixed(2)}</b></div>
                    <div><small>Max DD</small><b>$${metrics.maxDrawdown.toFixed(2)}</b></div>
                    <div><small>Trades</small><b>${metrics.totalTrades}</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.PerformanceAnalyticsEngineV67?.subscribe?.(render);
        window.EventBus?.subscribe?.("performance-analytics.updated", render);
    }

    window.PerformanceDashboardV67 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1600));
})();
