(function () {
    const KEY = "tios.decision.audit.v46_1";
    const MAX = 300;
    let rows = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
        catch { return []; }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX)));
    }

    function record(stage, payload = {}) {
        const decision = payload.decision || window.DecisionEngine?.current?.();
        const row = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            stage,
            symbol: decision?.symbol || payload.symbol || null,
            timeframe: decision?.timeframe || payload.timeframe || null,
            recommendation: decision?.recommendation || null,
            score: decision?.institutionalScore?.overall || null,
            timestamp: new Date().toISOString(),
        };

        rows.push(row);
        rows = rows.slice(-MAX);
        save();

        window.WorkspaceStore?.set?.("decisionAuditTrail", rows.slice());
        window.EventBus?.publish?.("decision-audit.updated", { row, rows: rows.slice() });
        return row;
    }

    function list(limit = 50) {
        return rows.slice(-limit).reverse();
    }

    function clear() {
        rows = [];
        save();
        window.WorkspaceStore?.set?.("decisionAuditTrail", []);
        window.EventBus?.publish?.("decision-audit.cleared", {});
    }

    window.EventBus?.subscribe?.("unified-opportunity.changed", payload => record("Unified Opportunity", payload));
    window.EventBus?.subscribe?.("decision.updated", payload => record("Decision Generated", payload));
    window.EventBus?.subscribe?.("risk.assessed", payload => record("Risk Assessed", payload));
    window.EventBus?.subscribe?.("workspace.sync.completed", payload => record("Workspace Sync Complete", payload));

    window.DecisionAuditTrail = { record, list, clear };
})();
