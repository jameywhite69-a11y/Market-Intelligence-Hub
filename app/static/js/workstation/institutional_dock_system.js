/*
Version 40-ready — Institutional Dock System

Turns the right workstation column into a tabbed dock so execution,
positions, AI, and diagnostics can scale without vertical clutter.
*/

(function () {
    const tabs = [
        { id: "execution", label: "Execution" },
        { id: "positions", label: "Positions" },
        { id: "ai", label: "AI" },
        { id: "diagnostics", label: "Diagnostics" },
    ];

    function moveIntoDock(panelId, tabId) {
        const panel = document.getElementById(panelId);
        const target = document.querySelector(`[data-dock-panel="${tabId}"]`);

        if (!panel || !target || panel.dataset.docked === "true") return;

        panel.dataset.docked = "true";
        target.appendChild(panel);
    }

    function buildDock() {
        const rightDock = document.querySelector(".workstation-right-dock");

        if (!rightDock || document.getElementById("institutionalDockSystem")) return;

        const dock = document.createElement("section");
        dock.id = "institutionalDockSystem";
        dock.className = "institutional-dock-system";

        dock.innerHTML = `
            <div class="institutional-dock-tabs">
                ${tabs.map((tab, index) => `
                    <button class="institutional-dock-tab ${index === 0 ? "active" : ""}" data-dock-tab="${tab.id}">
                        ${tab.label}
                    </button>
                `).join("")}
            </div>

            <div class="institutional-dock-body">
                ${tabs.map((tab, index) => `
                    <section class="institutional-dock-panel ${index === 0 ? "active" : ""}" data-dock-panel="${tab.id}"></section>
                `).join("")}
            </div>
        `;

        rightDock.prepend(dock);

        movePanelsIntoDock();
        bindDockTabs();
    }

    function movePanelsIntoDock() {
        // Execution tab
        moveIntoDock("brokerAdapterPanel", "execution");
        moveIntoDock("tradeContextPanel", "execution");
        moveIntoDock("liveMarketDataPanel", "execution");
        moveIntoDock("institutionalOrderTicket", "execution");
        moveIntoDock("tradingTerminalPanel", "execution");
        moveIntoDock("paperTradingPanel", "execution");
        moveIntoDock("strategyExecutionPanel", "execution");
        moveIntoDock("workspaceContextPanel", "execution");
        moveIntoDock("institutionalOrderTicketV42", "execution");

        // Positions tab
        moveIntoDock("positionManagementPanel", "positions");
        moveIntoDock("portfolioRiskPanel", "positions");
        moveIntoDock("positionLifecyclePanel", "positions");

        // AI tab
        moveIntoDock("opportunityPanel", "ai");
        moveIntoDock("aiDecisionCenterPanel", "ai");

        // Diagnostics tab
        moveIntoDock("coreDiagnosticsPanel", "diagnostics");
        moveIntoDock("eventDiagnosticsPanel", "diagnostics");
        moveIntoDock("scannerDiagnostics", "diagnostics");
        moveIntoDock("moduleRegistryPanel", "diagnostics");
        moveIntoDock("activityTimelinePanel", "diagnostics");
    }

    function bindDockTabs() {
        for (const tab of document.querySelectorAll("[data-dock-tab]")) {
            tab.addEventListener("click", () => activateTab(tab.dataset.dockTab));
        }
    }

    function activateTab(tabId) {
        for (const tab of document.querySelectorAll("[data-dock-tab]")) {
            tab.classList.toggle("active", tab.dataset.dockTab === tabId);
        }

        for (const panel of document.querySelectorAll("[data-dock-panel]")) {
            panel.classList.toggle("active", panel.dataset.dockPanel === tabId);
        }

        localStorage.setItem("mih.activeDockTab", tabId);
        window.EventBus?.publish?.("dock:tab-changed", { tabId });
    }

    function restoreLastTab() {
        const tabId = localStorage.getItem("mih.activeDockTab");
        if (tabId) activateTab(tabId);
    }

    function bootstrapDockSystem() {
        buildDock();
        movePanelsIntoDock();
        restoreLastTab();
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(bootstrapDockSystem, 100);
    });

    window.EventBus?.subscribe?.("scan:completed", () => {
        setTimeout(bootstrapDockSystem, 0);
    });

    window.EventBus?.subscribe?.("paper-order-filled", () => {
        setTimeout(bootstrapDockSystem, 0);
    });

    window.EventBus?.subscribe?.("market-data:tick", () => {
        setTimeout(bootstrapDockSystem, 0);
    });

    window.InstitutionalDockSystem = {
        bootstrapDockSystem,
        activateTab,
        movePanelsIntoDock,
    };
})();