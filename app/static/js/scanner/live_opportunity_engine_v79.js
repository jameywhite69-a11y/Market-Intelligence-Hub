/*
Version 79.0 — Live Opportunity Engine
Purpose:
- Convert realtime quotes into continuously updated paper-trading opportunities.
- Uses V78 market data adapter / V74 realtime bus.
- No live broker execution.
*/
(function () {
    const VERSION = "79.0";

    const STATE = {
        opportunities: [],
        lastSnapshot: null
    };

    function scoreQuote(q, index) {
        const change = Number(q.changePct || 0);
        const volume = Number(q.volume || 0);
        const price = Number(q.price || 0);

        const momentum = Math.max(0, Math.min(100, 50 + change * 12));
        const liquidity = Math.max(40, Math.min(100, volume ? Math.log10(volume) * 12 : 55));
        const trend = Math.max(0, Math.min(100, 55 + change * 8));
        const risk = Math.max(10, Math.min(90, 50 - change * 3 + index * 1.5));
        const score = Math.max(0, Math.min(100, momentum * 0.35 + liquidity * 0.25 + trend * 0.25 + (100 - risk) * 0.15));

        const decision =
            score >= 88 ? "READY" :
            score >= 78 ? "WATCH" :
            score >= 65 ? "WAIT" :
            "AVOID";

        const expectedR = Math.max(0.5, Math.min(4.0, score / 28));
        const stopDistance = Math.max(price * 0.012, 0.01);

        return {
            rank: index + 1,
            symbol: q.symbol,
            timeframe: "live",
            price,
            changePct: change,
            volume,
            score: Number(score.toFixed(1)),
            confidence: Number(Math.max(50, score - 3).toFixed(1)),
            decision,
            grade: score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : "C",
            momentum: Number(momentum.toFixed(1)),
            liquidity: Number(liquidity.toFixed(1)),
            trend: Number(trend.toFixed(1)),
            risk: Number(risk.toFixed(1)),
            expectedR: Number(expectedR.toFixed(2)),
            entry: price,
            stop: Number((price - stopDistance).toFixed(2)),
            tp1: Number((price + stopDistance * 1.5).toFixed(2)),
            tp2: Number((price + stopDistance * 2.5).toFixed(2)),
            source: q.source || "realtime",
            updatedAt: q.timestamp || new Date().toISOString()
        };
    }

    function build(snapshot) {
        const quotes = Object.values(snapshot?.quotes || {});
        const opportunities = quotes
            .map(scoreQuote)
            .sort((a, b) => b.score - a.score)
            .map((o, i) => ({ ...o, rank: i + 1 }));

        STATE.opportunities = opportunities;
        STATE.lastSnapshot = snapshot || null;

        window.TIOSInstitutionalScannerV56 = window.TIOSInstitutionalScannerV56 || {};
        window.TIOSInstitutionalScannerV56.latest = opportunities;

        window.EventBus?.publish?.("scanner.results.updated", { results: opportunities, source: "live-opportunity-v79" });
        window.EventBus?.publish?.("live-opportunities.updated", { opportunities, source: "live-opportunity-v79" });

        if (opportunities[0]) {
            window.EventBus?.publish?.("scanner.selection.changed", opportunities[0]);
            window.EventBus?.publish?.("unified-opportunity.changed", { key: "v79-live-top", value: opportunities[0] });
        }

        render();
        return opportunities;
    }

    function render() {
        const panel = document.getElementById("liveOpportunityEnginePanelV79");
        if (!panel) return;

        const rows = STATE.opportunities.slice(0, 10);

        panel.innerHTML = `
            <section class="v79-card">
                <div class="v79-header">
                    <div>
                        <h2>Live Opportunity Engine</h2>
                        <span>quote-driven scoring for paper trading</span>
                    </div>
                    <strong>${rows[0]?.symbol || "WAITING"}</strong>
                </div>

                <div class="v79-opportunity-list">
                    ${rows.map(row => `
                        <button data-symbol="${row.symbol}">
                            <b>#${row.rank} ${row.symbol}</b>
                            <span>${row.score.toFixed(1)}</span>
                            <em>${row.decision}</em>
                        </button>
                    `).join("") || "<div class='v79-empty'>Start the realtime data bus to generate live opportunities.</div>"}
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-symbol]").forEach(btn => {
            btn.addEventListener("click", () => {
                const found = STATE.opportunities.find(o => o.symbol === btn.dataset.symbol);
                if (found) {
                    window.EventBus?.publish?.("scanner.selection.changed", found);
                    window.EventBus?.publish?.("unified-opportunity.changed", { key: "v79-click", value: found });
                }
            });
        });
    }

    function wire() {
        window.EventBus?.subscribe?.("realtime-data.updated", build);
        window.EventBus?.subscribe?.("live-market-data.updated", build);
        setTimeout(() => {
            const snap = window.RealtimeDataBusV74?.getSnapshot?.();
            if (snap?.quotes && Object.keys(snap.quotes).length) build(snap);
            else render();
        }, 1800);
    }

    window.LiveOpportunityEngineV79 = {
        build,
        render,
        latest: () => STATE.opportunities.slice(),
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
