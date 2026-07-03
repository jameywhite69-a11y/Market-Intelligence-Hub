/*
Version 59.0 — Institutional Trade Engine
Builds a paper-only institutional trade plan from the unified decision state.
No live broker orders.
*/
(function () {
    const VERSION = "59.0";

    function latestDecision() {
        return window.UnifiedDecisionEngineV57?.get?.()
            || window.TIOSInstitutionalScannerV56?.latest?.[0]
            || {};
    }

    function n(value, fallback) {
        const x = Number(value);
        return Number.isFinite(x) ? x : fallback;
    }

    function plan(input) {
        const d = input || latestDecision();
        const symbol = d.symbol || "BTC";
        const timeframe = d.timeframe || "15m";
        const score = n(d.score, 60);
        const confidence = n(d.confidence, score);
        const expectedR = n(d.expectedR, 2.4);
        const entry = n(d.entry, 199.40);
        const stop = n(d.stop, 193.10);
        const tp1 = n(d.tp1, 203.60);
        const tp2 = n(d.tp2, 206.80);
        const riskScore = n(d.metrics?.risk ?? d.risk, 42);
        const decision = d.decision || (score >= 85 ? "WATCH" : "WAIT");

        const account = 100000;
        const maxDailyRisk = 1500;
        const riskPct =
            decision === "READY" ? 0.0075 :
            decision === "WATCH" ? 0.005 :
            decision === "WAIT" ? 0.0025 :
            0;

        const riskDollars = account * riskPct;
        const stopDistance = Math.max(0.01, Math.abs(entry - stop));
        const units = riskDollars > 0 ? Math.floor(riskDollars / stopDistance) : 0;
        const notional = units * entry;
        const capitalPct = (notional / account) * 100;

        const readinessChecks = [
            ["Trend", n(d.metrics?.trend, 68) >= 65],
            ["Momentum", n(d.metrics?.momentum, 64) >= 60],
            ["Structure", n(d.metrics?.structure, 58) >= 55],
            ["Liquidity", n(d.metrics?.liquidity, 72) >= 65],
            ["Risk", riskScore <= 55],
            ["Portfolio", n(d.metrics?.portfolioFit, 82) >= 70],
            ["Confidence", confidence >= 70],
            ["Expected R", expectedR >= 2.0],
            ["Capital", capitalPct <= 25],
            ["Broker", true]
        ];

        const passed = readinessChecks.filter(x => x[1]).length;
        const status =
            passed >= 9 && decision !== "AVOID" ? "READY TO EXECUTE" :
            passed >= 7 ? "STAGE PLAN" :
            passed >= 5 ? "MONITOR" :
            "STAND DOWN";

        return {
            version: VERSION,
            symbol,
            timeframe,
            score,
            confidence,
            expectedR,
            decision,
            status,
            entry,
            stop,
            tp1,
            tp2,
            account,
            riskPct,
            riskDollars,
            maxDailyRisk,
            stopDistance,
            units,
            notional,
            capitalPct,
            readinessChecks,
            passed,
            timestamp: new Date().toISOString()
        };
    }

    function publishPlan(input, source = "engine") {
        const tradePlan = plan(input);
        window.InstitutionalTradeEngineV59.current = tradePlan;

        window.EventBus?.publish?.("institutional-trade-plan.updated", {
            source,
            plan: tradePlan
        });

        render(tradePlan);
        return tradePlan;
    }

    function render(tradePlan = window.InstitutionalTradeEngineV59.current || plan()) {
        const panel = document.getElementById("institutionalTradeEnginePanel");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v59-trade-engine-card ${tradePlan.status.toLowerCase().replaceAll(" ", "-")}">
                <div class="v59-header">
                    <div>
                        <h2>Institutional Trade Engine</h2>
                        <span>${tradePlan.symbol} · ${tradePlan.timeframe} · paper execution plan</span>
                    </div>
                    <strong>${tradePlan.status}</strong>
                </div>

                <div class="v59-trade-grid">
                    <div><small>Entry</small><b>${tradePlan.entry.toFixed(2)}</b></div>
                    <div><small>Stop</small><b>${tradePlan.stop.toFixed(2)}</b></div>
                    <div><small>TP1</small><b>${tradePlan.tp1.toFixed(2)}</b></div>
                    <div><small>TP2</small><b>${tradePlan.tp2.toFixed(2)}</b></div>
                    <div><small>Expected R</small><b>${tradePlan.expectedR.toFixed(2)}R</b></div>
                    <div><small>Confidence</small><b>${tradePlan.confidence.toFixed(1)}%</b></div>
                    <div><small>Risk</small><b>$${tradePlan.riskDollars.toFixed(2)}</b></div>
                    <div><small>Units</small><b>${tradePlan.units}</b></div>
                    <div><small>Notional</small><b>$${tradePlan.notional.toFixed(2)}</b></div>
                    <div><small>Capital</small><b>${tradePlan.capitalPct.toFixed(1)}%</b></div>
                </div>

                <div class="v59-readiness-strip">
                    ${tradePlan.readinessChecks.map(([name, ok]) => `
                        <span class="${ok ? "pass" : "fail"}">${ok ? "✓" : "!"} ${name}</span>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("institutional-decision.updated", payload => publishPlan(payload, "decision"));
        window.EventBus?.subscribe?.("scanner.selection.changed", payload => publishPlan(payload, "selection"));
        window.EventBus?.subscribe?.("unified-opportunity.changed", payload => {
            if (payload?.value) publishPlan(payload.value, "opportunity");
        });

        setTimeout(() => publishPlan(latestDecision(), "bootstrap"), 1200);
    }

    window.InstitutionalTradeEngineV59 = {
        plan,
        publishPlan,
        render,
        current: null,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 800));
})();
