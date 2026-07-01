/*
Version 45.0 — Workspace Synchronization Engine

Coordinates key subsystem refreshes when the canonical opportunity changes.
*/

(function () {
    function syncOpportunity(payload = {}) {
        const opportunity = payload.opportunity || window.UnifiedOpportunityStore?.get?.();
        if (!opportunity) return;

        window.EventBus?.publish?.("workspace.sync.started", { opportunity });

        try { window.AIDecisionCenterPanel?.renderAIDecisionCenterPanel?.(); } catch {}
        try { window.InstitutionalRiskPanel?.renderInstitutionalRiskPanel?.(); } catch {}
        try { window.PortfolioIntelligencePanelV42?.refreshPortfolioIntelligencePanel?.(); } catch {}
        try { window.TradeLifecyclePanel?.syncLifecycleFromSelectedOpportunity?.({ opportunity, source: "workspace-sync" }); } catch {}
        try { window.CommandCenterOrchestrator?.refreshCommandCenter?.("workspace-sync"); } catch {}
        try { window.ActivityTimelineStore?.addEvent?.("workspace.sync.completed", { opportunity }, "sync"); } catch {}

        window.EventBus?.publish?.("workspace.sync.completed", { opportunity });
    }

    function syncStartup() {
        const opportunity = window.UnifiedOpportunityStore?.get?.();
        if (opportunity) syncOpportunity({ opportunity });
    }

    window.EventBus?.subscribe?.("unified-opportunity.changed", syncOpportunity);
    window.EventBus?.subscribe?.("paper-order-filled", () => setTimeout(syncStartup, 100));
    window.EventBus?.subscribe?.("risk.assessed", () => window.EventBus?.publish?.("workspace.sync.risk-updated", {}));

    document.addEventListener("DOMContentLoaded", () => setTimeout(syncStartup, 1000));

    window.WorkspaceSynchronizationEngine = {
        syncOpportunity,
        syncStartup,
    };
})();
