/*
Version 83.0 — Paper Trading Command Center
Purpose:
- Unifies V79 live opportunities, V80 paper account, V81 risk manager, and V82 AI assistant.
- Provides a single command surface for paper trading.
- Paper only. No live broker execution.
*/
(function () {
    const VERSION = "83.0";

    function state() {
        const top = window.LiveOpportunityEngineV79?.latest?.()?.[0] || {};
        const account = window.PaperTradingAccountV80?.snapshot?.() || {};
        const risk = window.PositionRiskManagerV81?.analyze?.() || {};
        const ai = window.AITradingAssistantV82?.recommendation?.() || {};
        return { top, account, risk, ai };
    }

    function stageTop() {
        return window.PaperTradingAccountV80?.stageOrder?.();
    }

    function submitLatest() {
        return window.PaperTradingAccountV80?.submitOrder?.();
    }

    function closeFirst() {
        return window.PaperTradingAccountV80?.closePosition?.();
    }

    function render() {
        const panel = document.getElementById("paperTradingCommandCenterPanelV83");
        if (!panel) return;

        const s = state();
        const openPositions = (s.account.positions || []).filter(p => p.status === "OPEN").length;
        const latestOrder = (s.account.orders || [])[0];

        panel.innerHTML = `
            <section class="v83-card ${String(s.ai.action || "wait").toLowerCase().replaceAll(" ", "-")}">
                <div class="v83-header">
                    <div>
                        <h2>Paper Trading Command Center</h2>
                        <span>live opportunity → AI guidance → paper account → risk manager</span>
                    </div>
                    <strong>${s.ai.action || "WAIT"}</strong>
                </div>

                <div class="v83-grid">
                    <div><small>Top Symbol</small><b>${s.top.symbol || "—"}</b></div>
                    <div><small>Score</small><b>${Number(s.top.score || 0).toFixed(1)}</b></div>
                    <div><small>Cash</small><b>$${Number(s.account.cash || 0).toFixed(2)}</b></div>
                    <div><small>Equity</small><b>$${Number(s.account.equity || 0).toFixed(2)}</b></div>
                    <div><small>Open Pos.</small><b>${openPositions}</b></div>
                    <div><small>Risk</small><b>${Number(s.risk.riskPct || 0).toFixed(2)}%</b></div>
                    <div><small>Latest Order</small><b>${latestOrder?.status || "—"}</b></div>
                    <div><small>Assistant</small><b>${s.ai.action || "WAIT"}</b></div>
                </div>

                <div class="v83-note">
                    <b>AI Rationale</b>
                    <span>${s.ai.reason || "Waiting for live opportunity and paper account context."}</span>
                </div>

                <div class="v83-actions">
                    <button id="v83StageTop">Stage Top Paper</button>
                    <button id="v83SubmitLatest">Submit Latest Paper</button>
                    <button id="v83CloseFirst">Close First Open</button>
                    <button id="v83Refresh">Refresh</button>
                </div>
            </section>
        `;

        document.getElementById("v83StageTop")?.addEventListener("click", () => { stageTop(); render(); });
        document.getElementById("v83SubmitLatest")?.addEventListener("click", () => { submitLatest(); render(); });
        document.getElementById("v83CloseFirst")?.addEventListener("click", () => { closeFirst(); render(); });
        document.getElementById("v83Refresh")?.addEventListener("click", render);

        window.EventBus?.publish?.("paper-command-center-v83.updated", { version: VERSION, state: s });
    }

    function wire() {
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("position-risk-v81.updated", render);
        window.EventBus?.subscribe?.("ai-trading-assistant.updated", render);
        setTimeout(render, 1800);
    }

    window.PaperTradingCommandCenterV83 = {
        state,
        stageTop,
        submitLatest,
        closeFirst,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
