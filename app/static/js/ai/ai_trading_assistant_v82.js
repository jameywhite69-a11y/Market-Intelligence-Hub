/*
Version 82.0 — AI Trading Assistant
Purpose:
- Combines V79 live opportunities, V80 paper account, and V81 position risk into one assistant recommendation.
- Paper trading only. No live broker execution.
*/
(function () {
    const VERSION = "82.0";

    function topOpportunity() {
        return window.LiveOpportunityEngineV79?.latest?.()?.[0]
            || window.MarketContextStoreV63?.get?.()?.selected
            || {};
    }

    function riskModel() {
        return window.PositionRiskManagerV81?.analyze?.()
            || { positions: [], status: "Unknown", riskPct: 0, avgR: 0 };
    }

    function account() {
        return window.PaperTradingAccountV80?.snapshot?.()
            || { equity: 100000, cash: 100000, positions: [] };
    }

    function marketContext() {
        return window.InstitutionalMarketContextEngineV62?.get?.()
            || window.MarketContextStoreV63?.get?.()?.marketContext
            || {};
    }

    function recommendation() {
        const o = topOpportunity();
        const r = riskModel();
        const a = account();
        const m = marketContext();

        const score = Number(o.score || 0);
        const confidence = Number(o.confidence || score || 0);
        const riskPct = Number(r.riskPct || 0);
        const cash = Number(a.cash || 0);
        const regime = m.regime || "Neutral";
        const permission = m.tradePermission || "Normal Watch";

        let action = "WAIT";
        let reason = "No qualifying live opportunity yet.";

        if (score >= 88 && confidence >= 80 && riskPct < 2 && cash > 1000 && !["Defense Only", "Reduce / Avoid"].includes(permission)) {
            action = "PAPER BUY READY";
            reason = "Live opportunity quality, confidence, market context, and paper risk budget align.";
        } else if (score >= 78) {
            action = "WATCH";
            reason = "Opportunity is improving but still requires confirmation or reduced risk.";
        } else if (["Defense Only", "Reduce / Avoid"].includes(permission)) {
            action = "DEFENSIVE";
            reason = "Market context does not support aggressive new paper trades.";
        }

        return {
            version: VERSION,
            symbol: o.symbol || "—",
            action,
            reason,
            score,
            confidence,
            entry: Number(o.entry || o.price || 0),
            stop: Number(o.stop || 0),
            tp1: Number(o.tp1 || 0),
            tp2: Number(o.tp2 || 0),
            expectedR: Number(o.expectedR || 0),
            marketRegime: regime,
            marketPermission: permission,
            portfolioRisk: riskPct,
            openPositions: (a.positions || []).filter(p => p.status === "OPEN").length,
            cash,
            timestamp: new Date().toISOString()
        };
    }

    function render() {
        const panel = document.getElementById("aiTradingAssistantPanelV82");
        if (!panel) return;

        const rec = recommendation();

        panel.innerHTML = `
            <section class="v82-card ${rec.action.toLowerCase().replaceAll(" ", "-")}">
                <div class="v82-header">
                    <div>
                        <h2>AI Trading Assistant</h2>
                        <span>${rec.symbol} · live opportunity + paper portfolio context</span>
                    </div>
                    <strong>${rec.action}</strong>
                </div>

                <div class="v82-grid">
                    <div><small>Score</small><b>${rec.score.toFixed(1)}</b></div>
                    <div><small>Confidence</small><b>${rec.confidence.toFixed(1)}%</b></div>
                    <div><small>Entry</small><b>${rec.entry.toFixed(2)}</b></div>
                    <div><small>Stop</small><b>${rec.stop.toFixed(2)}</b></div>
                    <div><small>TP1</small><b>${rec.tp1.toFixed(2)}</b></div>
                    <div><small>Expected R</small><b>${rec.expectedR.toFixed(2)}R</b></div>
                    <div><small>Regime</small><b>${rec.marketRegime}</b></div>
                    <div><small>Permission</small><b>${rec.marketPermission}</b></div>
                    <div><small>Risk</small><b>${rec.portfolioRisk.toFixed(2)}%</b></div>
                    <div><small>Open Pos.</small><b>${rec.openPositions}</b></div>
                    <div><small>Cash</small><b>$${rec.cash.toFixed(2)}</b></div>
                    <div><small>Mode</small><b>PAPER</b></div>
                </div>

                <div class="v82-note">
                    <b>Assistant Rationale</b>
                    <span>${rec.reason}</span>
                </div>
            </section>
        `;

        window.EventBus?.publish?.("ai-trading-assistant.updated", rec);
    }

    function wire() {
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("position-risk-v81.updated", render);
        window.EventBus?.subscribe?.("market-context.updated", render);
        setTimeout(render, 1800);
    }

    window.AITradingAssistantV82 = {
        recommendation,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
