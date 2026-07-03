/*
Version 64.0 — Portfolio Intelligence Store
Single portfolio state source for exposure, correlation, risk budget, and portfolio health.
Paper/simulated portfolio only. No live broker orders.
*/
(function () {
    const VERSION = "64.0";
    const STATE = {
        account: {
            equity: 100000,
            cash: 75000.01,
            buyingPower: 100000,
            dailyRiskLimitPct: 2.0,
            dailyRiskUsedPct: 0.75,
            realizedPnl: 0,
            unrealizedPnl: 0
        },
        positions: [],
        pendingOrders: [],
        subscribers: new Set(),
        revision: 0
    };

    function clone(value) {
        try { return JSON.parse(JSON.stringify(value)); }
        catch { return value; }
    }

    function selectedOpportunity() {
        return window.MarketContextStoreV63?.get?.()?.selected
            || window.UnifiedDecisionEngineV57?.get?.()
            || {};
    }

    function latestWorkflow() {
        return window.ExecutionWorkflowEngineV60?.get?.()
            || window.InstitutionalTradeEngineV59?.current
            || {};
    }

    function simulatedPositions() {
        const selected = selectedOpportunity();
        const workflow = latestWorkflow();

        const base = [
            { symbol: "BTC", assetClass: "Crypto", theme: "Digital Assets", side: "LONG", notional: 18500, risk: 375, quality: 88, correlationGroup: "Crypto Majors" },
            { symbol: "SOL", assetClass: "Crypto", theme: "High Beta Crypto", side: "LONG", notional: 9200, risk: 240, quality: 82, correlationGroup: "Crypto High Beta" },
            { symbol: "Cash", assetClass: "Cash", theme: "Cash", side: "FLAT", notional: STATE.account.cash, risk: 0, quality: 100, correlationGroup: "Cash" }
        ];

        if (selected.symbol && selected.symbol !== "—" && selected.symbol !== "BTC" && selected.symbol !== "SOL") {
            base.unshift({
                symbol: selected.symbol,
                assetClass: "Crypto",
                theme: "Candidate",
                side: "PROPOSED",
                notional: Number(workflow.notional || selected.allocation * 1000 || 6500),
                risk: Number(workflow.riskDollars || 250),
                quality: Number(selected.score || 70),
                correlationGroup: "Crypto Candidates"
            });
        }

        return base;
    }

    function recalc(reason = "recalc") {
        STATE.positions = simulatedPositions();
        STATE.revision += 1;

        const snapshot = get();
        snapshot.reason = reason;

        STATE.subscribers.forEach(fn => {
            try { fn(snapshot); }
            catch (err) { console.warn("[PortfolioIntelligenceStoreV64 subscriber]", err); }
        });

        window.EventBus?.publish?.("portfolio-intelligence-store.updated", snapshot);
        return snapshot;
    }

    function get() {
        return {
            version: VERSION,
            revision: STATE.revision,
            account: clone(STATE.account),
            positions: clone(STATE.positions),
            pendingOrders: clone(STATE.pendingOrders)
        };
    }

    function subscribe(fn) {
        STATE.subscribers.add(fn);
        setTimeout(() => fn(get()), 0);
        return () => STATE.subscribers.delete(fn);
    }

    function wire() {
        window.EventBus?.subscribe?.("market-context-store.updated", () => recalc("context-store"));
        window.EventBus?.subscribe?.("execution-workflow.updated", () => recalc("execution-workflow"));
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", () => recalc("trade-plan"));
        setTimeout(() => recalc("bootstrap"), 1600);
    }

    window.PortfolioIntelligenceStoreV64 = {
        get,
        recalc,
        subscribe,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
