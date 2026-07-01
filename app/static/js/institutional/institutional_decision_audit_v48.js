(function () {
    const KEY = "tios.institutional.audit.v48";
    const MAX = 400;
    let rows = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
        catch { return []; }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX)));
    }

    function record(type, payload = {}) {
        const pkg = payload.package || window.InstitutionalDecisionPackage?.current?.();
        const row = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type,
            symbol: pkg?.symbol || null,
            timeframe: pkg?.timeframe || null,
            recommendation: pkg?.recommendation || null,
            score: pkg?.institutionalScore || null,
            detail: payload.detail || pkg?.summary || "",
            timestamp: new Date().toISOString(),
        };

        rows.push(row);
        rows = rows.slice(-MAX);
        save();

        window.WorkspaceStore?.set?.("institutionalDecisionAudit", rows.slice());
        window.EventBus?.publish?.("institutional-decision-audit.updated", { row, rows: rows.slice() });
        return row;
    }

    function list(limit = 30) {
        return rows.slice(-limit).reverse();
    }

    window.EventBus?.subscribe?.("institutional-decision-package.updated", payload => record("Decision Package", payload));
    window.EventBus?.subscribe?.("decision-stage-pipeline.updated", payload => record("Stage Pipeline", { detail: "Pipeline refreshed", ...payload }));

    window.InstitutionalDecisionAuditV48 = {
        record,
        list,
    };
})();
