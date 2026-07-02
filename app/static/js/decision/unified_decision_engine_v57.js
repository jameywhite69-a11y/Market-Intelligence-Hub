/*
Version 57.0 — Unified Institutional Decision Engine
Centralizes opportunity state so scanner, AI Commander, risk, package,
readiness, and execution planner all consume one institutional object.
No live orders. Analysis and paper-ready only.
*/
(function () {
    const VERSION = "57.0";
    const STATE = {
        current: null,
        history: []
    };

    function n(value, fallback) {
        const x = Number(value);
        return Number.isFinite(x) ? x : fallback;
    }

    function clamp(value) {
        return Math.max(0, Math.min(100, Math.round(n(value, 0))));
    }

    function grade(score) {
        if (score >= 92) return "A+";
        if (score >= 86) return "A";
        if (score >= 80) return "A-";
        if (score >= 72) return "B";
        if (score >= 64) return "C";
        return "Avoid";
    }

    function command(score, confidence, risk) {
        if (score >= 92 && confidence >= 82 && risk <= 50) return "READY";
        if (score >= 84 && confidence >= 72) return "WATCH";
        if (score >= 72) return "WAIT";
        return "AVOID";
    }

    function normalize(input) {
        const row = input?.value || input || {};
        const symbol = row.symbol || window.ScannerSelectionUnifier?.current?.()?.symbol || "ETH";
        const timeframe = row.timeframe || row.tf || window.ScannerSelectionUnifier?.current?.()?.timeframe || "1h";

        const trend = clamp(row.trend ?? row.trendScore ?? 68);
        const momentum = clamp(row.momentum ?? row.momentumScore ?? 64);
        const structure = clamp(row.structure ?? row.structureScore ?? 58);
        const liquidity = clamp(row.liquidity ?? row.liquidityScore ?? 72);
        const volatility = clamp(row.volatility ?? row.volatilityScore ?? 70);
        const portfolioFit = clamp(row.portfolioFit ?? row.portfolioFitScore ?? 82);
        const risk = clamp(row.risk ?? row.riskScore ?? row.riskQuality ?? 42);
        const volume = clamp(row.volume ?? row.volumeScore ?? 66);
        const relativeStrength = clamp(row.relativeStrength ?? row.rs ?? row.relativeStrengthScore ?? 68);

        const score = n(
            row.score ?? row.opportunityScore ?? row.validationScore,
            trend * 0.17 +
            momentum * 0.15 +
            structure * 0.12 +
            liquidity * 0.12 +
            portfolioFit * 0.16 +
            volume * 0.10 +
            relativeStrength * 0.10 +
            (100 - risk) * 0.08
        );

        const confidence = n(row.confidence ?? row.confidenceScore, Math.min(98, score + 1.5));
        const expectedR = n(row.expectedR ?? row.expectedReward, Math.max(0.6, score / 31));
        const decision = row.decision || command(score, confidence, risk);
        const allocation = n(row.allocation ?? row.allocationPct, decision === "READY" ? 20 : decision === "WATCH" ? 12.5 : decision === "WAIT" ? 6.5 : 0);

        const entry = n(row.entry ?? row.idealEntry, 199.40);
        const stop = n(row.stop ?? row.stopLoss, 193.10);
        const tp1 = n(row.tp1 ?? row.takeProfit1, 203.60);
        const tp2 = n(row.tp2 ?? row.takeProfit2, 206.80);

        const checks = {
            scanner: score >= 60,
            validation: score >= 72,
            trend: trend >= 65,
            momentum: momentum >= 60,
            structure: structure >= 55,
            liquidity: liquidity >= 65,
            risk: risk <= 55,
            portfolio: portfolioFit >= 70,
            broker: true,
            capital: allocation > 0
        };

        const passed = Object.values(checks).filter(Boolean).length;
        const readiness =
            passed >= 9 ? "EXECUTION READY" :
            passed >= 7 ? "PLAN ONLY" :
            passed >= 5 ? "MONITOR" :
            "NOT READY";

        return {
            version: VERSION,
            id: `${symbol}-${timeframe}-${Date.now()}`,
            timestamp: new Date().toISOString(),
            symbol,
            timeframe,
            score: Number(score.toFixed(1)),
            grade: grade(score),
            decision,
            confidence: Number(confidence.toFixed(1)),
            expectedR: Number(expectedR.toFixed(2)),
            allocation: Number(allocation.toFixed(1)),
            entry,
            stop,
            tp1,
            tp2,
            metrics: {
                trend,
                momentum,
                structure,
                liquidity,
                volatility,
                portfolioFit,
                risk,
                volume,
                relativeStrength
            },
            checks,
            passed,
            readiness,
            summary: `${symbol} ${timeframe} is ${decision}. Institutional score ${score.toFixed(1)}, confidence ${confidence.toFixed(1)}%, expected return ${expectedR.toFixed(2)}R.`
        };
    }

    function set(input, source = "unknown") {
        const model = normalize(input);
        model.source = source;
        STATE.current = model;
        STATE.history.unshift(model);
        STATE.history = STATE.history.slice(0, 50);

        window.EventBus?.publish?.("institutional-decision.updated", model);
        window.EventBus?.publish?.("decision.updated", model);
        window.EventBus?.publish?.("unified-opportunity.changed", { key: "v57", value: model });
        render(model);
        return model;
    }

    function render(model = STATE.current) {
        const panel = document.getElementById("unifiedDecisionEnginePanel");
        if (!panel || !model) return;

        const m = model.metrics;
        panel.innerHTML = `
            <section class="v57-decision-card ${model.decision.toLowerCase()}">
                <div class="v57-header">
                    <div>
                        <h2>Unified Institutional Decision</h2>
                        <span>${model.symbol} · ${model.timeframe} · ${model.source || "system"}</span>
                    </div>
                    <strong>${model.decision}</strong>
                </div>

                <div class="v57-decision-grid">
                    <div><small>Score</small><b>${model.score}</b></div>
                    <div><small>Grade</small><b>${model.grade}</b></div>
                    <div><small>Confidence</small><b>${model.confidence}%</b></div>
                    <div><small>Expected R</small><b>${model.expectedR}R</b></div>
                    <div><small>Allocation</small><b>${model.allocation}%</b></div>
                    <div><small>Readiness</small><b>${model.readiness}</b></div>
                </div>

                <div class="v57-metric-grid">
                    ${metric("Trend", m.trend)}
                    ${metric("Momentum", m.momentum)}
                    ${metric("Structure", m.structure)}
                    ${metric("Liquidity", m.liquidity)}
                    ${metric("Portfolio", m.portfolioFit)}
                    ${metric("Risk Control", 100 - m.risk)}
                </div>

                <div class="v57-summary">${model.summary}</div>
            </section>
        `;
    }

    function metric(label, value) {
        const v = clamp(value);
        return `<div class="v57-metric"><span>${label}</span><b>${v}</b><i><em style="width:${v}%"></em></i></div>`;
    }

    function bootstrap() {
        window.EventBus?.subscribe?.("scanner.selection.changed", payload => set(payload, "scanner.selection"));
        window.EventBus?.subscribe?.("scanner.results.updated", payload => {
            const first = payload?.results?.[0];
            if (first) set(first, "scanner.results");
        });

        set({
            symbol: "ETH",
            timeframe: "1h",
            score: 73.3,
            confidence: 73.3,
            expectedR: 2.4
        }, "bootstrap");
    }

    window.UnifiedDecisionEngineV57 = {
        set,
        get: () => STATE.current,
        history: () => STATE.history.slice(),
        render,
        normalize,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(bootstrap, 1400));
})();
