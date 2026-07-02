/* Version 49.1 — Inventory-Safe Institutional Dock System */
(function () {
    const DOCK_MAP = {
        execution: ["brokerAdapterPanel","institutionalCommandCenterPanel","brokerManagerPanel","tradeContextPanel","institutionalOrderTicket","tradingTerminalPanel","paperTradingPanel"],
        positions: ["positionManagementPanel","portfolioRiskPanel","positionLifecyclePanel","portfolioIntelligencePanel","tradeLifecyclePanel","institutionalRiskPanel"],
        ai: ["opportunityPanel","decisionPipelineMonitorPanel","decisionObjectInspectorPanel","decisionAuditTrailPanel","institutionalDecisionAuditPanelV48","aiDecisionCenterPanel","newsCatalystCenterPanel","strategyRegistryPanel"],
        diagnostics: ["liveMarketDataPanel","workspaceContextPanel","moduleRegistryPanel","workspaceHealthDashboardPanel","activityTimelinePanel","tradeJournalPanel","workspaceProfilesPanel","commercialReadinessPanel","automationCenterPanel"]
    };

    function getPanel(tabId) { return document.querySelector(`[data-dock-panel="${tabId}"]`); }

    function activateTab(tabId) {
        if (!tabId || !DOCK_MAP[tabId]) tabId = "execution";
        document.querySelectorAll("[data-dock-tab]").forEach(tab => tab.classList.toggle("active", tab.dataset.dockTab === tabId));
        document.querySelectorAll("[data-dock-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.dockPanel === tabId));
        localStorage.setItem("mih.activeDockTab", tabId);
        window.EventBus?.publish?.("dock:tab-changed", { tabId });
        return tabId;
    }

    function moveIntoDock(elementId, tabId) {
        const element = document.getElementById(elementId);
        const panel = getPanel(tabId);
        if (!element || !panel) return false;
        element.dataset.docked = "true";
        panel.appendChild(element);
        return true;
    }

    function movePanels() {
        const result = {};
        Object.entries(DOCK_MAP).forEach(([tabId, ids]) => {
            result[tabId] = { moved: [], missing: [] };
            ids.forEach(id => (moveIntoDock(id, tabId) ? result[tabId].moved : result[tabId].missing).push(id));
        });
        return result;
    }

    function wireTabs() {
        document.querySelectorAll("[data-dock-tab]").forEach(tab => {
            tab.onclick = event => {
                event.preventDefault();
                activateTab(tab.dataset.dockTab);
            };
        });
    }

    function validateDockDom() {
        return {
            tabs: document.querySelectorAll("[data-dock-tab]").length,
            panels: document.querySelectorAll("[data-dock-panel]").length
        };
    }

    function debugState() {
        return {
            dom: validateDockDom(),
            activeTab: localStorage.getItem("mih.activeDockTab") || "execution",
            panels: [...document.querySelectorAll("[data-dock-panel]")].map(panel => ({
                tab: panel.dataset.dockPanel,
                className: panel.className,
                display: getComputedStyle(panel).display,
                children: panel.children.length
            }))
        };
    }

    function initDockSystem() {
        const dom = validateDockDom();
        if (dom.tabs !== 4 || dom.panels !== 4) {
            console.warn("[TIOS Dock] DOM incomplete", dom);
            return false;
        }
        wireTabs();
        const moved = movePanels();
        activateTab(localStorage.getItem("mih.activeDockTab") || "execution");
        console.log("[TIOS Dock] ready", { dom, moved, state: debugState() });
        return true;
    }

    window.InstitutionalDockSystem = { activateTab, moveIntoDock, movePanels, initDockSystem, debugState, validateDockDom };
    document.addEventListener("DOMContentLoaded", () => setTimeout(initDockSystem, 250));
})();
