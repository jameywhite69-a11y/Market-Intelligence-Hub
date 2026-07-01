(function () {
    function safeJson(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return "{}";
        }
    }

    function renderDecisionObjectInspector() {
        const panel = document.getElementById("decisionObjectInspectorPanel");
        if (!panel) return;

        const decision = window.DecisionEngine?.current?.() || window.WorkspaceStore?.get?.("currentDecision");
        const opportunity = window.UnifiedOpportunityStore?.get?.();

        panel.innerHTML = `
            <section class="decision-inspector-card">
                <div class="terminal-card-header">
                    <h3>Decision Object Inspector</h3>
                    <span>${decision?.symbol || opportunity?.symbol || "Waiting"}</span>
                </div>

                <details open>
                    <summary>Current Decision</summary>
                    <pre>${safeJson(decision)}</pre>
                </details>

                <details>
                    <summary>Unified Opportunity</summary>
                    <pre>${safeJson(opportunity)}</pre>
                </details>

                <details>
                    <summary>Workspace Context</summary>
                    <pre>${safeJson(window.WorkspaceContext?.snapshot?.())}</pre>
                </details>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", renderDecisionObjectInspector);
    window.EventBus?.subscribe?.("unified-opportunity.changed", renderDecisionObjectInspector);
    window.EventBus?.subscribe?.("workspace.context.changed", renderDecisionObjectInspector);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderDecisionObjectInspector, 1300));

    window.DecisionObjectInspector = {
        renderDecisionObjectInspector
    };
})();
