(function () {
    function bridgeOpportunity(payload) {
        const opportunity = payload?.opportunity;
        if (opportunity) window.WorkspaceContext?.setSelectedOpportunity?.(opportunity, payload.source || "opportunity-store");
    }
    function bridgeBrokerChange() {
        const select = document.getElementById("brokerAdapterSelect");
        if (select?.value) window.WorkspaceContext?.setBroker?.(select.value);
    }
    window.EventBus?.subscribe?.("opportunity:selected", bridgeOpportunity);
    window.EventBus?.subscribe?.("paper-order-filled", () => window.WorkspaceContext?.setLifecycle?.("Position Opened"));
    window.EventBus?.subscribe?.("market-data:connected", () => window.WorkspaceContext?.update?.({ marketData: "connected" }, "market-data"));
    window.EventBus?.subscribe?.("market-data:disconnected", () => window.WorkspaceContext?.update?.({ marketData: "disconnected" }, "market-data"));
    document.addEventListener("change", e => { if (e.target?.id === "brokerAdapterSelect") bridgeBrokerChange(); });
    document.addEventListener("DOMContentLoaded", () => setTimeout(bridgeBrokerChange, 500));
    window.WorkspaceContextBridge = { bridgeOpportunity, bridgeBrokerChange };
})();
