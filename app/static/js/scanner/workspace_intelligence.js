const WORKSPACE_INTEL_STORAGE_KEY = "mih.workspace.intelligence.v27_2_s2";

function loadWorkspaceIntelState() {
    try {
        return JSON.parse(localStorage.getItem(WORKSPACE_INTEL_STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveWorkspaceIntelState(state) {
    localStorage.setItem(WORKSPACE_INTEL_STORAGE_KEY, JSON.stringify(state));
}

function scoreBar(value) {
    const score = Math.max(0, Math.min(100, Number(value || 0)));
    return `
        <div class="score-gauge">
            <div class="score-gauge-track">
                <div class="score-gauge-fill" style="width:${score}%"></div>
            </div>
            <b>${score.toFixed(1)}</b>
        </div>
    `;
}

function buildOpportunityHistory(results) {
    const state = loadWorkspaceIntelState();
    const history = state.history || {};

    for (const result of results || []) {
        const key = scannerUtils.resultKey(result);
        const score = Number(result.score || 0);

        history[key] = history[key] || [];
        history[key].push({
            score,
            time: new Date().toISOString(),
        });

        if (history[key].length > 50) {
            history[key] = history[key].slice(-50);
        }
    }

    state.history = history;
    saveWorkspaceIntelState(state);

    return history;
}

function historyDirection(historyRows) {
    if (!historyRows || historyRows.length < 2) return "new";

    const first = historyRows[0].score;
    const last = historyRows[historyRows.length - 1].score;
    const delta = last - first;

    if (delta >= 3) return "rising";
    if (delta <= -3) return "falling";
    return "stable";
}

function sparkline(historyRows) {
    if (!historyRows || !historyRows.length) return "";

    const values = historyRows.map(row => Number(row.score || 0));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = Math.max(1, max - min);

    const points = values.map((value, index) => {
        const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
        const y = 30 - ((value - min) / spread) * 30;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return `
        <svg class="mini-sparkline" viewBox="0 0 100 32" preserveAspectRatio="none">
            <polyline points="${points}" />
        </svg>
    `;
}

function renderOpportunityHeatmap(results) {
    const panel = document.getElementById("opportunityHeatmap");
    if (!panel) return;

    const rows = [...(results || [])]
        .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
        .slice(0, 12);

    if (!rows.length) {
        panel.innerHTML = "";
        return;
    }

    panel.innerHTML = `
        <div class="workspace-widget-header">
            <h3>Opportunity Heat Map</h3>
            <span>${rows.length} strongest</span>
        </div>
        <div class="heatmap-grid">
            ${rows.map(row => {
                const score = Number(row.score || 0);
                return `
                    <button class="heatmap-cell" data-key="${scannerUtils.resultKey(row)}">
                        <b>${row.symbol}</b>
                        <span>${score.toFixed(1)}</span>
                        ${scoreBar(score)}
                    </button>
                `;
            }).join("")}
        </div>
    `;

    for (const button of panel.querySelectorAll("[data-key]")) {
        button.addEventListener("click", () => {
            window.scannerResults?.selectResult(button.dataset.key);
        });
    }
}

function renderWorkspaceProfiles() {
    const panel = document.getElementById("workspaceProfiles");
    if (!panel) return;

    const state = loadWorkspaceIntelState();
    const active = state.profile || "Day Trading";
    const profiles = ["Day Trading", "Swing Trading", "Crypto", "Futures", "Four-Monitor"];

    panel.innerHTML = `
        <div class="workspace-widget-header">
            <h3>Workspace Profile</h3>
            <span>${active}</span>
        </div>
        <div class="profile-button-row">
            ${profiles.map(profile => `
                <button class="${profile === active ? "active" : ""}" data-profile="${profile}">
                    ${profile}
                </button>
            `).join("")}
        </div>
    `;

    for (const button of panel.querySelectorAll("[data-profile]")) {
        button.addEventListener("click", () => {
            const current = loadWorkspaceIntelState();
            current.profile = button.dataset.profile;
            saveWorkspaceIntelState(current);
            renderWorkspaceProfiles();
        });
    }
}

function renderOpportunityHistory(results) {
    const panel = document.getElementById("opportunityHistory");
    if (!panel) return;

    const history = buildOpportunityHistory(results || []);
    const rows = [...(results || [])]
        .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
        .slice(0, 8);

    if (!rows.length) {
        panel.innerHTML = "";
        return;
    }

    panel.innerHTML = `
        <div class="workspace-widget-header">
            <h3>Opportunity History</h3>
            <span>Last 50 scans</span>
        </div>
        <div class="history-list">
            ${rows.map(result => {
                const key = scannerUtils.resultKey(result);
                const rows = history[key] || [];
                return `
                    <button class="history-row" data-key="${key}">
                        <b>${result.symbol}</b>
                        <span>${historyDirection(rows)}</span>
                        ${sparkline(rows)}
                    </button>
                `;
            }).join("")}
        </div>
    `;

    for (const button of panel.querySelectorAll("[data-key]")) {
        button.addEventListener("click", () => {
            window.scannerResults?.selectResult(button.dataset.key);
        });
    }
}

function renderMultiWatchlistDashboard() {
    const panel = document.getElementById("multiWatchlistDashboard");
    if (!panel) return;

    const watchlists = scannerState.watchlists || [];

    if (!watchlists.length) {
        panel.innerHTML = "";
        return;
    }

    panel.innerHTML = `
        <div class="workspace-widget-header">
            <h3>Watchlist Dashboard</h3>
            <span>${watchlists.length} lists</span>
        </div>
        <div class="watchlist-dashboard-grid">
            ${watchlists.slice(0, 6).map(watchlist => {
                const symbols = watchlist.symbols || [];
                const matching = (scannerState.results || []).filter(result => symbols.includes(result.symbol));
                const elite = matching.filter(result => Number(result.score || 0) >= 90).length;
                const tradeable = matching.filter(result => Number(result.score || 0) >= 80).length;
                return `
                    <div class="watchlist-dashboard-card">
                        <b>${watchlist.name}</b>
                        <span>${symbols.length} symbols</span>
                        <small>${elite} Elite · ${tradeable} Tradeable</small>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function renderWorkspaceIntelligence(results) {
    renderWorkspaceProfiles();
    renderMultiWatchlistDashboard();
    renderOpportunityHeatmap(results || []);
    renderOpportunityHistory(results || []);
}

window.workspaceIntelligence = {
    renderWorkspaceIntelligence,
    renderWorkspaceProfiles,
    renderMultiWatchlistDashboard,
    renderOpportunityHeatmap,
    renderOpportunityHistory,
};
