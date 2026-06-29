const TRADING_DESK_UX_KEY = "mih.tradingDeskUx.v28_1";

function loadTradingDeskUxState() {
    try {
        return {
            compactTop: true,
            decisionPanelVisible: true,
            ...JSON.parse(localStorage.getItem(TRADING_DESK_UX_KEY) || "{}"),
        };
    } catch {
        return {
            compactTop: true,
            decisionPanelVisible: true,
        };
    }
}

function saveTradingDeskUxState(state) {
    localStorage.setItem(TRADING_DESK_UX_KEY, JSON.stringify(state));
}

function applyTradingDeskUxState() {
    const state = loadTradingDeskUxState();
    document.body.classList.toggle("top-widgets-compact", state.compactTop);
    document.body.classList.toggle("decision-panel-hidden", !state.decisionPanelVisible);
}

function bindTradingDeskUxControls() {
    const topToggle = document.getElementById("compactTopToggle");
    const panelToggle = document.getElementById("decisionPanelToggle");

    topToggle?.addEventListener("click", () => {
        const state = loadTradingDeskUxState();
        state.compactTop = !state.compactTop;
        saveTradingDeskUxState(state);
        applyTradingDeskUxState();
    });

    panelToggle?.addEventListener("click", () => {
        const state = loadTradingDeskUxState();
        state.decisionPanelVisible = !state.decisionPanelVisible;
        saveTradingDeskUxState(state);
        applyTradingDeskUxState();
    });

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
            event.preventDefault();
            const state = loadTradingDeskUxState();
            state.decisionPanelVisible = !state.decisionPanelVisible;
            saveTradingDeskUxState(state);
            applyTradingDeskUxState();
        }
    });
}

function bootstrapTradingDeskUx() {
    applyTradingDeskUxState();
    bindTradingDeskUxControls();
}

window.tradingDeskUx = {
    bootstrapTradingDeskUx,
    applyTradingDeskUxState,
};

document.addEventListener("DOMContentLoaded", bootstrapTradingDeskUx);
