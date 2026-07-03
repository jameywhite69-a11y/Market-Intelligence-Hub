/*
Version 66.0 — Bracket Order Panel
Paper/live-ready bracket preview. No live submission.
*/
(function () {
    const VERSION = "66.0";

    function latestPlan() {
        return window.InstitutionalTradeEngineV59?.current
            || window.ExecutionWorkflowEngineV60?.get?.()
            || {};
    }

    function model() {
        const p = latestPlan();
        return {
            symbol: p.symbol || "—",
            side: p.side || "BUY",
            qty: Number(p.units || 0),
            entry: Number(p.entry || 0),
            stop: Number(p.stop || 0),
            tp1: Number(p.tp1 || 0),
            tp2: Number(p.tp2 || 0),
            risk: Number(p.riskDollars || 0),
            rr: Number(p.expectedR || 0)
        };
    }

    function render() {
        const panel = document.getElementById("bracketOrderPanelV66");
        if (!panel) return;

        const m = model();

        panel.innerHTML = `
            <section class="v66-card">
                <div class="v66-header">
                    <div>
                        <h2>Bracket Order Preview</h2>
                        <span>${m.symbol} · ${m.side}</span>
                    </div>
                    <strong>${m.rr.toFixed(2)}R</strong>
                </div>

                <div class="v66-grid">
                    <div><small>Quantity</small><b>${m.qty}</b></div>
                    <div><small>Entry</small><b>${m.entry.toFixed(2)}</b></div>
                    <div><small>Stop</small><b>${m.stop.toFixed(2)}</b></div>
                    <div><small>TP1</small><b>${m.tp1.toFixed(2)}</b></div>
                    <div><small>TP2</small><b>${m.tp2.toFixed(2)}</b></div>
                    <div><small>Risk</small><b>$${m.risk.toFixed(2)}</b></div>
                </div>

                <div class="v66-note">
                    <b>Execution Guard</b>
                    <span>This preview is paper/live-ready infrastructure only. Live broker routing remains disabled until credentials and broker permissions are explicitly configured.</span>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", render);
        window.EventBus?.subscribe?.("execution-workflow.updated", render);
        setTimeout(render, 1600);
    }

    window.BracketOrderPanelV66 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1100));
})();
