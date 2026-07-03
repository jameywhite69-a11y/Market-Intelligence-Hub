/*
Version 81.0 — Position & Risk Manager
Purpose:
- Manage V80 paper positions with live mark-to-market, R-multiple, stop/target state, and portfolio risk.
- Paper trading only. No live broker execution.
*/
(function () {
    const VERSION = "81.0";

    function account() {
        return window.PaperTradingAccountV80?.snapshot?.() || { positions: [], cash: 0, equity: 100000 };
    }

    function quotes() {
        return window.RealtimeDataBusV74?.getSnapshot?.()?.quotes || {};
    }

    function enrichPosition(position, quoteMap) {
        const q = quoteMap[position.symbol] || {};
        const mark = Number(q.price || position.mark || position.entry || 0);
        const entry = Number(position.entry || 0);
        const stop = Number(position.stop || entry * 0.985);
        const tp1 = Number(position.tp1 || entry * 1.02);
        const tp2 = Number(position.tp2 || entry * 1.035);
        const qty = Number(position.qty || 0);
        const riskPerUnit = Math.max(0.01, Math.abs(entry - stop));
        const unrealizedPnl = (mark - entry) * qty;
        const rMultiple = unrealizedPnl / Math.max(1, riskPerUnit * qty);

        let lifecycle = "Managing";
        if (mark <= stop) lifecycle = "Stop Threat";
        else if (mark >= tp2) lifecycle = "Runner / TP2";
        else if (mark >= tp1) lifecycle = "TP1 Zone";

        return {
            ...position,
            mark,
            stop,
            tp1,
            tp2,
            unrealizedPnl,
            rMultiple,
            lifecycle,
            distanceToStopPct: mark ? ((mark - stop) / mark) * 100 : 0,
            distanceToTp1Pct: mark ? ((tp1 - mark) / mark) * 100 : 0,
            updatedAt: new Date().toISOString()
        };
    }

    function analyze() {
        const acct = account();
        const quoteMap = quotes();
        const openPositions = (acct.positions || [])
            .filter(p => p.status === "OPEN")
            .map(p => enrichPosition(p, quoteMap));

        const totalRisk = openPositions.reduce((a, p) => a + Math.max(0, (Number(p.entry) - Number(p.stop)) * Number(p.qty)), 0);
        const totalUnrealized = openPositions.reduce((a, p) => a + Number(p.unrealizedPnl || 0), 0);
        const avgR = openPositions.length ? openPositions.reduce((a, p) => a + Number(p.rMultiple || 0), 0) / openPositions.length : 0;
        const equity = Number(acct.equity || 100000);
        const riskPct = equity ? (totalRisk / equity) * 100 : 0;

        return {
            version: VERSION,
            positions: openPositions,
            totalRisk,
            totalUnrealized,
            avgR,
            riskPct,
            status: riskPct <= 1 ? "Controlled" : riskPct <= 2 ? "Elevated" : "Hot",
            timestamp: new Date().toISOString()
        };
    }

    function render() {
        const panel = document.getElementById("positionRiskManagerPanelV81");
        if (!panel) return;

        const model = analyze();

        panel.innerHTML = `
            <section class="v81-card ${model.status.toLowerCase()}">
                <div class="v81-header">
                    <div>
                        <h2>Position & Risk Manager</h2>
                        <span>live mark-to-market · R multiple · stop/target lifecycle</span>
                    </div>
                    <strong>${model.status}</strong>
                </div>

                <div class="v81-grid">
                    <div><small>Open Positions</small><b>${model.positions.length}</b></div>
                    <div><small>Total Risk</small><b>$${model.totalRisk.toFixed(2)}</b></div>
                    <div><small>Risk %</small><b>${model.riskPct.toFixed(2)}%</b></div>
                    <div><small>Unrealized</small><b>$${model.totalUnrealized.toFixed(2)}</b></div>
                    <div><small>Avg R</small><b>${model.avgR.toFixed(2)}R</b></div>
                    <div><small>Status</small><b>${model.status}</b></div>
                </div>
            </section>
        `;

        window.EventBus?.publish?.("position-risk-v81.updated", model);
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("realtime-data.updated", render);
        setTimeout(render, 1500);
    }

    window.PositionRiskManagerV81 = { analyze, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
