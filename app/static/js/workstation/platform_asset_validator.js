/* Version 44.0 — Platform Asset Validator */
(function () {
    const REQUIRED_DOM = ["brokerAdapterPanel","institutionalOrderTicket","paperTradingPanel","positionManagementPanel","opportunityPanel","activityTimelinePanel"];

    function validateDom() {
        return REQUIRED_DOM.map(id => ({ id, present: !!document.getElementById(id) }));
    }

    function validateDock() {
        return {
            tabs: document.querySelectorAll("[data-dock-tab]").length,
            panels: document.querySelectorAll("[data-dock-panel]").length,
            api: typeof window.InstitutionalDockSystem
        };
    }

    function report() {
        const payload = { dom: validateDom(), dock: validateDock(), timestamp: new Date().toISOString() };
        console.log("[TIOS Platform Validator]", payload);
        window.WorkspaceStore?.set?.("platformValidation", payload);
        window.EventBus?.publish?.("platform.validation", payload);
        return payload;
    }

    document.addEventListener("DOMContentLoaded", () => setTimeout(report, 900));
    window.PlatformAssetValidator = { report, validateDom, validateDock };
})();
