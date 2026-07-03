/*
Version 67.0 — Equity Curve Panel
Lightweight visual equity curve using simple bars.
*/
(function () {
    const VERSION = "67.0";

    function render(metrics) {
        const panel = document.getElementById("equityCurvePanelV67");
        if (!panel || !metrics) return;

        const curve = metrics.equityCurve || [];
        const min = Math.min(...curve.map(x => x.equity), 100000);
        const max = Math.max(...curve.map(x => x.equity), 100000);
        const range = Math.max(1, max - min);

        panel.innerHTML = `
            <section class="v67-card">
                <div class="v67-header">
                    <div>
                        <h2>Equity Curve</h2>
                        <span>paper portfolio progression</span>
                    </div>
                    <strong>$${(curve[curve.length - 1]?.equity || 100000).toFixed(2)}</strong>
                </div>

                <div class="v67-equity-bars">
                    ${curve.map(point => {
                        const height = 20 + ((point.equity - min) / range) * 70;
                        return `<i title="${point.symbol}: $${point.equity.toFixed(2)}" style="height:${height}%"></i>`;
                    }).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.PerformanceAnalyticsEngineV67?.subscribe?.(render);
        window.EventBus?.subscribe?.("performance-analytics.updated", render);
    }

    window.EquityCurvePanelV67 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1800));
})();
