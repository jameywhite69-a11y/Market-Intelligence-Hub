/*
Version 43.0 — Institutional Command Center Store
Aggregates WorkspaceContext, AI, Risk, Automation, Lifecycle, Portfolio, and Timeline state.
*/
(function () {
    const state = {
        lastUpdated: null,
        selectedOpportunity: null,
        aiDecision: null,
        riskAssessment: null,
        portfolio: null,
        lifecycle: null,
        automation: null,
        execution: null,
        readiness: "Waiting",
    };

    function update(patch, source = "system") {
        Object.assign(state, patch, { lastUpdated: new Date().toISOString(), source });
        window.WorkspaceStore?.set?.("commandCenterState", snapshot());
        window.EventBus?.publish?.("command-center.updated", snapshot());
        return snapshot();
    }

    function snapshot() {
        return JSON.parse(JSON.stringify(state));
    }

    function readinessLabel() {
        const risk = state.riskAssessment?.decision || "Waiting";
        const ai = state.aiDecision?.recommendation || "Waiting";
        const selected = !!state.selectedOpportunity;

        if (!selected) return "Waiting";
        if (String(risk).includes("Rejected")) return "Blocked";
        if (String(ai).includes("Execution Ready") && String(risk).includes("Approved")) return "Execution Ready";
        if (String(risk).includes("Caution")) return "Caution";
        return "Review";
    }

    function recompute(source = "system") {
        state.readiness = readinessLabel();
        return update({}, source);
    }

    window.CommandCenterStore = {
        update,
        snapshot,
        recompute,
    };
})();
