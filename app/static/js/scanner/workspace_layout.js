const WORKSPACE_STORAGE_KEY = "mih.workspace.layout.v27_2";

const defaultWorkspaceState = {
    inspectorWidth: 460,
    sidebarWidth: 300,
    queuePosition: "top",
};

function loadWorkspaceState() {
    try {
        return {
            ...defaultWorkspaceState,
            ...JSON.parse(localStorage.getItem(WORKSPACE_STORAGE_KEY) || "{}"),
        };
    } catch {
        return { ...defaultWorkspaceState };
    }
}

function saveWorkspaceState(state) {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state));
}

function applyWorkspaceState(state) {
    document.documentElement.style.setProperty("--workspace-sidebar-width", `${state.sidebarWidth}px`);
    document.documentElement.style.setProperty("--workspace-inspector-width", `${state.inspectorWidth}px`);

    const queue = document.getElementById("opportunityQueue");
    if (queue) {
        queue.dataset.position = state.queuePosition || "top";
    }
}

function bindPanelResizers() {
    const state = loadWorkspaceState();
    applyWorkspaceState(state);

    bindResizer("leftPanelResizer", "sidebarWidth", 240, 420);
    bindResizer("rightPanelResizer", "inspectorWidth", 360, 620);
}

function bindResizer(id, key, min, max) {
    const handle = document.getElementById(id);
    if (!handle) return;

    let isDragging = false;

    handle.addEventListener("mousedown", () => {
        isDragging = true;
        document.body.classList.add("is-resizing");
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const state = loadWorkspaceState();

        if (key === "sidebarWidth") {
            state.sidebarWidth = Math.min(max, Math.max(min, event.clientX - 20));
        }

        if (key === "inspectorWidth") {
            state.inspectorWidth = Math.min(max, Math.max(min, window.innerWidth - event.clientX - 20));
        }

        applyWorkspaceState(state);
        saveWorkspaceState(state);
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.classList.remove("is-resizing");
    });
}

function bindWorkspaceShortcuts() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "F5") {
            event.preventDefault();
            if (window.scannerOrchestrator) {
                window.scannerOrchestrator.runScanner({ automatic: false });
            }
        }

        if (!event.ctrlKey) return;

        const focusMap = {
            "1": ".scanner-filter-panel",
            "2": ".scanner-results-panel",
            "3": ".opportunity-panel",
            "4": ".opportunity-queue-panel",
        };

        const selector = focusMap[event.key];

        if (selector) {
            event.preventDefault();
            document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    });
}

function bindWorkspaceLayout() {
    bindPanelResizers();
    bindWorkspaceShortcuts();
}

window.workspaceLayout = {
    bindWorkspaceLayout,
    loadWorkspaceState,
    saveWorkspaceState,
    applyWorkspaceState,
};
