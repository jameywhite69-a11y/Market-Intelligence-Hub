/*
Version 43.0 — Institutional Command Center Orchestrator
Connects the event-driven workflow into one command-center state.
*/
(function () {
    async function loadPortfolio() {
        if (!window.portfolioIntelligenceClient) return null;
        try {
            return await window.portfolioIntelligenceClient.snapshot();
        } catch {
            return null;
        }
    }

    async function loadRisk() {
        if (!window.institutionalRiskClient) return null;
        const context = window.WorkspaceContext?.snapshot?.() || {};
        const opportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.();
        if (!opportunity) return null;
        try {
            return await window.institutionalRiskClient.assess({ ...context, selectedOpportunity: opportunity });
        } catch {
            return null;
        }
    }

    async function loadAiDecision() {
        if (!window.aiDecisionClient) return null;
        const context = window.WorkspaceContext?.snapshot?.() || {};
        const opportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.();
        if (!opportunity) return null;
        try {
            return await window.aiDecisionClient.analyze({ ...context, selectedOpportunity: opportunity });
        } catch {
            return null;
        }
    }

    async function refreshCommandCenter(source = "manual") {
        const context = window.WorkspaceContext?.snapshot?.() || {};
        const selectedOpportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.() || null;
        const execution = window.WorkspaceStore?.get?.("executionSnapshot") || {};
        const automation = {
            rules: window.AutomationCenter?.rules || [],
            active: (window.AutomationCenter?.rules || []).filter(rule => rule.enabled).length,
        };

        const [portfolio, riskAssessment, aiDecision] = await Promise.all([
            loadPortfolio(),
            loadRisk(),
            loadAiDecision(),
        ]);

        window.CommandCenterStore?.update?.({
            selectedOpportunity,
            execution,
            automation,
            portfolio,
            riskAssessment,
            aiDecision,
            lifecycle: window.WorkspaceContext?.snapshot?.()?.lifecycle || "Idle",
        }, source);

        window.CommandCenterStore?.recompute?.(source);
    }

    function registerCommandCenterListeners() {
        if (window.__commandCenterListenersRegistered) return;
        window.__commandCenterListenersRegistered = true;

        const events = [
            "workspace.context.changed",
            "opportunity:selected",
            "risk.assessed",
            "paper-order-filled",
            "paper-order-rejected",
            "portfolio-intelligence.updated",
            "trade-lifecycle.updated",
            "activity.timeline.updated",
            "market-data:connected",
            "market-data:disconnected",
            "mih.ready",
        ];

        for (const eventName of events) {
            window.EventBus?.subscribe?.(eventName, () => {
                setTimeout(() => refreshCommandCenter(eventName), 0);
            });
        }

        document.addEventListener("paper-trade-updated", () => refreshCommandCenter("paper-trade-updated"));
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            registerCommandCenterListeners();
            refreshCommandCenter("startup");
        }, 700);
    });

    window.CommandCenterOrchestrator = {
        refreshCommandCenter,
        registerCommandCenterListeners,
    };
})();
