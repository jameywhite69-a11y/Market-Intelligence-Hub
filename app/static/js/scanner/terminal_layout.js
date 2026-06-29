const TERMINAL_LAYOUT_KEY = "mih.terminalLayout.v28_2";

function loadTerminalLayoutState() {
    try {
        return {
            topDockCollapsed: false,
            bottomDockCollapsed: false,
            decisionPanelVisible: true,
            ...JSON.parse(localStorage.getItem(TERMINAL_LAYOUT_KEY) || "{}"),
        };
    } catch {
        return {
            topDockCollapsed: false,
            bottomDockCollapsed: false,
            decisionPanelVisible: true,
        };
    }
}

function saveTerminalLayoutState(state) {
    localStorage.setItem(TERMINAL_LAYOUT_KEY, JSON.stringify(state));
}

function applyTerminalLayoutState() {
    const state = loadTerminalLayoutState();

    document.body.classList.toggle("terminal-top-collapsed", state.topDockCollapsed);
    document.body.classList.toggle("terminal-bottom-collapsed", state.bottomDockCollapsed);
    document.body.classList.toggle("decision-panel-hidden", !state.decisionPanelVisible);
}

function toggleTerminalState(key) {
    const state = loadTerminalLayoutState();
    state[key] = !state[key];
    saveTerminalLayoutState(state);
    applyTerminalLayoutState();
}

function bindTerminalLayoutControls() {
    document.getElementById("terminalTopToggle")?.addEventListener("click", () => {
        toggleTerminalState("topDockCollapsed");
    });

    document.getElementById("terminalBottomToggle")?.addEventListener("click", () => {
        toggleTerminalState("bottomDockCollapsed");
    });

    document.getElementById("terminalDecisionToggle")?.addEventListener("click", () => {
        toggleTerminalState("decisionPanelVisible");
    });

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "t") {
            event.preventDefault();
            toggleTerminalState("topDockCollapsed");
        }

        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "b") {
            event.preventDefault();
            toggleTerminalState("bottomDockCollapsed");
        }

        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
            event.preventDefault();
            toggleTerminalState("decisionPanelVisible");
        }
    });
}

function bootstrapTerminalLayout() {
    applyTerminalLayoutState();
    bindTerminalLayoutControls();

    if (window.opportunityPanel) {
        window.opportunityPanel.clearOpportunityPanel();
    }
}

window.terminalLayout = {
    bootstrapTerminalLayout,
    applyTerminalLayoutState,
};

document.addEventListener("DOMContentLoaded", bootstrapTerminalLayout);
