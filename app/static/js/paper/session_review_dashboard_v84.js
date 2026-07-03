/*
Version 84.0 — Session Review Dashboard
*/
(function () {
    const VERSION = "84.0";

    function build() {
        const acct = window.PaperTradingAccountV80?.snapshot?.() || { trades: [], orders: [], positions: [] };
        const trades = acct.trades || [];
        const wins = trades.filter(t => Number(t.pnl || 0) > 0).length;
        const losses = trades.filter(t => Number(t.pnl || 0) < 0).length;
        const pnl = trades.reduce((a, t) => a + Number(t.pnl || 0), 0);
        const avgR = trades.length ? trades.reduce((a, t) => a + Number(t.r || 0), 0) / trades.length : 0;
        const open = (acct.positions || []).filter(p => p.status === "OPEN").length;

        return {
            trades: trades.length,
            wins,
            losses,
            pnl,
            avgR,
            open,
            orders: (acct.orders || []).length,
            status: pnl > 0 ? "Positive" : pnl < 0 ? "Negative" : "Flat"
        };
    }

    function render() {
        const panel = document.getElementById("sessionReviewDashboardPanelV84");
        if (!panel) return;

        const s = build();

        panel.innerHTML = `
            <section class="v84-card ${s.status.toLowerCase()}">
                <div class="v84-header">
                    <div>
                        <h2>Session Review Dashboard</h2>
                        <span>paper session performance summary</span>
                    </div>
                    <strong>${s.status}</strong>
                </div>

                <div class="v84-grid">
                    <div><small>Trades</small><b>${s.trades}</b></div>
                    <div><small>Wins</small><b>${s.wins}</b></div>
                    <div><small>Losses</small><b>${s.losses}</b></div>
                    <div><small>P/L</small><b>$${s.pnl.toFixed(2)}</b></div>
                    <div><small>Avg R</small><b>${s.avgR.toFixed(2)}R</b></div>
                    <div><small>Open</small><b>${s.open}</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        setTimeout(render, 1800);
    }

    window.SessionReviewDashboardV84 = { build, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
