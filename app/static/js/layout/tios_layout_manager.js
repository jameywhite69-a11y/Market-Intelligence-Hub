/*
Version 50.0 — TIOS Layout Manager
Builds a professional workstation from the Panel Registry.
*/
(function () {
    const VERSION = "50.0";

    const REGIONS = {
        centerTop: "tiosRegionCenterTop",
        centerDecision: "tiosRegionCenterDecision",
        centerResults: "tiosRegionCenterResults",
        rightExecution: "tiosDockExecution",
        rightPositions: "tiosDockPositions",
        rightAI: "tiosDockAI",
        rightDiagnostics: "tiosDockDiagnostics"
    };

    function ensureElement(tag, id, className, parent) {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement(tag);
            el.id = id;
            if (className) el.className = className;
            parent.appendChild(el);
        }
        return el;
    }

    function createShell() {
        if (document.getElementById("tiosLayoutManagerShell")) return true;

        const body = document.body;
        const shell = document.createElement("section");
        shell.id = "tiosLayoutManagerShell";
        shell.className = "tios-layout-manager-shell";
        shell.innerHTML = `
            <aside id="tiosLayoutLeft" class="tios-layout-left"></aside>

            <main id="tiosLayoutCenter" class="tios-layout-center">
                <section id="tiosRegionCenterTop" class="tios-region-center-top"></section>
                <section id="tiosRegionCenterDecision" class="tios-region-center-decision"></section>
                <section id="tiosRegionCenterResults" class="tios-region-center-results"></section>
            </main>

            <aside id="tiosLayoutRight" class="tios-layout-right">
                <div class="institutional-dock tios-managed-dock">
                    <div class="institutional-dock-tabs">
                        <button class="institutional-dock-tab active" data-layout-tab="execution">Execution</button>
                        <button class="institutional-dock-tab" data-layout-tab="positions">Positions</button>
                        <button class="institutional-dock-tab" data-layout-tab="ai">AI</button>
                        <button class="institutional-dock-tab" data-layout-tab="diagnostics">Diagnostics</button>
                    </div>
                    <div class="institutional-dock-panels">
                        <div id="tiosDockExecution" class="institutional-dock-panel active" data-layout-panel="execution"></div>
                        <div id="tiosDockPositions" class="institutional-dock-panel" data-layout-panel="positions"></div>
                        <div id="tiosDockAI" class="institutional-dock-panel" data-layout-panel="ai"></div>
                        <div id="tiosDockDiagnostics" class="institutional-dock-panel" data-layout-panel="diagnostics"></div>
                    </div>
                </div>
            </aside>
        `;

        const original =
            document.querySelector(".workstation-main-grid") ||
            document.querySelector(".tios-three-column-layout") ||
            document.querySelector(".terminal-workspace") ||
            document.querySelector("main") ||
            null;

        if (original && original.parentNode) {
            original.parentNode.insertBefore(shell, original);
            original.classList.add("tios-original-layout-hidden");
        } else {
            body.appendChild(shell);
        }

        moveLeftRail();
        wireManagedDock();
        return true;
    }

    function moveLeftRail() {
        const left = document.querySelector(".workstation-left-dock") ||
            document.querySelector(".tios-left-rail") ||
            document.querySelector(".scanner-filter-panel");

        const dest = document.getElementById("tiosLayoutLeft");
        if (left && dest && left !== dest) {
            dest.appendChild(left);
            left.classList.add("tios-layout-left-content");
        }
    }

    function findPanelElement(panel) {
        if (panel.id === "workstationResultsPanel") {
            return document.querySelector(".workstation-results-panel");
        }
        return document.getElementById(panel.id);
    }

    function placePanel(panel) {
        const targetId = REGIONS[panel.region];
        const target = document.getElementById(targetId);
        const element = findPanelElement(panel);
        if (!target || !element) return false;

        element.dataset.layoutManaged = "true";
        element.dataset.layoutRegion = panel.region;
        element.classList.add("tios-layout-panel");
        if (panel.height === "compact") element.classList.add("tios-layout-panel-compact");

        target.appendChild(element);
        return true;
    }

    function render() {
        if (document.body.dataset.tiosLayoutRendered === "true") {
        console.log("[TIOS Layout Manager] render skipped - already rendered");
        return { moved: [], missing: [], skipped: true };
}

document.body.dataset.tiosLayoutRendered = "true";
        createShell();

        const moved = [];
        const missing = [];

    for (const regionId of Object.values(REGIONS)) {
    const region = document.getElementById(regionId);
    if (!region) continue;

    [...region.children].forEach(child => {
        if (child.dataset.layoutManaged !== "true") {
            child.remove();
        }
    });
    }

        const panels = window.TIOSPanelRegistry?.all?.() || [];
        panels.forEach(panel => {
            if (placePanel(panel)) moved.push(panel.id);
            else missing.push(panel.id);
        });

        document.body.dataset.tiosLayoutManager = VERSION;
        window.EventBus?.publish?.("layout.rendered", { version: VERSION, moved, missing });
        console.log("[TIOS Layout Manager]", { version: VERSION, moved, missing });
        return { moved, missing };
    }

    function wireManagedDock() {
        document.querySelectorAll("[data-layout-tab]").forEach(tab => {
            tab.onclick = event => {
                event.preventDefault();
                activateDock(tab.dataset.layoutTab);
            };
        });
    }

    function activateDock(tabId) {
        document.querySelectorAll("[data-layout-tab]").forEach(tab => {
            tab.classList.toggle("active", tab.dataset.layoutTab === tabId);
        });

        document.querySelectorAll("[data-layout-panel]").forEach(panel => {
            panel.classList.toggle("active", panel.dataset.layoutPanel === tabId);
        });

        localStorage.setItem("tios.layout.activeDock", tabId);
        return tabId;
    }

    function boot() {
       setTimeout(() => {
            render();
            activateDock(localStorage.getItem("tios.layout.activeDock") || "execution");
        }, 1800);
    }

    window.TIOSLayoutManager = {
        render,
        createShell,
        activateDock,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", boot);
})();
