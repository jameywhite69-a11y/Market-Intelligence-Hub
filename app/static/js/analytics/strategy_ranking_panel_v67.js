/*
Version 67.0 — Strategy Ranking Panel
Ranks strategies by paper P&L and average R.
*/
(function () {
    const VERSION = "67.0";

    function rank(metrics) {
        const groups = {};
        (metrics?.trades || []).forEach(t => {
            const name = t.strategy || "Unknown";
            groups[name] = groups[name] || { strategy: name, trades: 0, pnl: 0, r: 0, wins: 0 };
            groups[name].trades += 1;
            groups[name].pnl += Number(t.pnl || 0);
            groups[name].r += Number(t.r || 0);
            if (Number(t.pnl || 0) > 0) groups[name].wins += 1;
        });

        return Object.values(groups)
            .map(g => ({
                ...g,
                avgR: g.trades ? g.r / g.trades : 0,
                winRate: g.trades ? (g.wins / g.trades) * 100 : 0
            }))
            .sort((a, b) => b.pnl - a.pnl);
    }

    function render(metrics) {
        const panel = document.getElementById("strategyRankingPanelV67");
        if (!panel || !metrics) return;

        const rows = rank(metrics);

        panel.innerHTML = `
            <section class="v67-card">
                <div class="v67-header">
                    <div>
                        <h2>Strategy Rankings</h2>
                        <span>paper performance by strategy</span>
                    </div>
                    <strong>${rows[0]?.strategy || "—"}</strong>
                </div>

                <div class="v67-table">
                    ${rows.map(row => `
                        <div>
                            <b>${row.strategy}</b>
                            <span>${row.trades} trades</span>
                            <em>$${row.pnl.toFixed(2)} · ${row.avgR.toFixed(2)}R</em>
                        </div>
                    `).join("") || "<div class='v67-empty'>No strategy data yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.PerformanceAnalyticsEngineV67?.subscribe?.(render);
        window.EventBus?.subscribe?.("performance-analytics.updated", render);
    }

    window.StrategyRankingPanelV67 = { rank, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1700));
})();
