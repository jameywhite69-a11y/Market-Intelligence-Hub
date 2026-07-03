/*
Version 73.0 — Unified Settings Store
Centralized local configuration for risk, AI behavior, watchlists, UI, and execution safety.
Local browser storage only. No credentials. No live broker execution.
*/
(function () {
    const VERSION = "73.0";
    const KEY = "mih.tios.unified.settings.v73";

    const DEFAULTS = {
        risk: {
            accountSize: 100000,
            maxDailyRiskPct: 2.0,
            maxTradeRiskPct: 0.75,
            maxPortfolioHeat: 70
        },
        ai: {
            confidenceFloor: 72,
            requireMarketContext: true,
            suppressRiskOffTrades: true,
            coachingEnabled: true
        },
        execution: {
            mode: "paper",
            requireManualApproval: true,
            allowLiveOrders: false,
            defaultAdapter: "paper"
        },
        watchlist: {
            defaultSymbols: "BTC,ETH,SOL,LINK,AVAX",
            defaultTimeframes: "15m,1h,4h",
            maxCandidates: 24
        },
        ui: {
            productionMode: true,
            compactPanels: false,
            activeProfile: "Institutional Default"
        }
    };

    function mergeDeep(target, source) {
        const out = { ...target };
        Object.keys(source || {}).forEach(key => {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                out[key] = mergeDeep(out[key] || {}, source[key]);
            } else {
                out[key] = source[key];
            }
        });
        return out;
    }

    function load() {
        try {
            return mergeDeep(DEFAULTS, JSON.parse(localStorage.getItem(KEY)) || {});
        } catch {
            return JSON.parse(JSON.stringify(DEFAULTS));
        }
    }

    function save(partial) {
        const next = mergeDeep(load(), partial || {});
        localStorage.setItem(KEY, JSON.stringify(next));
        window.EventBus?.publish?.("unified-settings.updated", next);
        render();
        return next;
    }

    function reset() {
        localStorage.removeItem(KEY);
        const next = load();
        window.EventBus?.publish?.("unified-settings.updated", next);
        render();
        return next;
    }

    function exportJson() {
        return JSON.stringify(load(), null, 2);
    }

    function importJson(text) {
        const parsed = JSON.parse(text);
        return save(parsed);
    }

    function render() {
        const panel = document.getElementById("unifiedSettingsPanelV73");
        if (!panel) return;

        const s = load();

        panel.innerHTML = `
            <section class="v73-card">
                <div class="v73-header">
                    <div>
                        <h2>Unified Settings Store</h2>
                        <span>risk · AI · execution · watchlist · UI</span>
                    </div>
                    <strong>${s.execution.mode.toUpperCase()}</strong>
                </div>

                <div class="v73-grid">
                    <div><small>Account</small><b>$${Number(s.risk.accountSize).toLocaleString()}</b></div>
                    <div><small>Daily Risk</small><b>${s.risk.maxDailyRiskPct}%</b></div>
                    <div><small>Trade Risk</small><b>${s.risk.maxTradeRiskPct}%</b></div>
                    <div><small>AI Floor</small><b>${s.ai.confidenceFloor}%</b></div>
                    <div><small>Approval</small><b>${s.execution.requireManualApproval ? "manual" : "auto"}</b></div>
                    <div><small>Live Orders</small><b>${s.execution.allowLiveOrders ? "enabled" : "blocked"}</b></div>
                </div>

                <div class="v73-actions">
                    <button id="v73ApplySafeDefaults">Safe Defaults</button>
                    <button id="v73ToggleCompact">Toggle Compact</button>
                    <button id="v73ResetSettings">Reset Settings</button>
                    <button id="v73CopySettings">Copy JSON</button>
                </div>

                <textarea id="v73SettingsJson" spellcheck="false">${exportJson()}</textarea>
                <div class="v73-actions">
                    <button id="v73ImportSettings">Import JSON From Box</button>
                </div>
            </section>
        `;

        document.getElementById("v73ApplySafeDefaults")?.addEventListener("click", () => save({
            execution: { mode: "paper", requireManualApproval: true, allowLiveOrders: false, defaultAdapter: "paper" },
            ai: { suppressRiskOffTrades: true, requireMarketContext: true }
        }));

        document.getElementById("v73ToggleCompact")?.addEventListener("click", () => save({
            ui: { compactPanels: !load().ui.compactPanels }
        }));

        document.getElementById("v73ResetSettings")?.addEventListener("click", reset);

        document.getElementById("v73CopySettings")?.addEventListener("click", async () => {
            const text = exportJson();
            try { await navigator.clipboard.writeText(text); } catch {}
            const box = document.getElementById("v73SettingsJson");
            if (box) box.value = text;
        });

        document.getElementById("v73ImportSettings")?.addEventListener("click", () => {
            const box = document.getElementById("v73SettingsJson");
            try { importJson(box?.value || "{}"); }
            catch (err) { alert("Invalid JSON settings."); }
        });
    }

    function applyToExistingSystems(settings = load()) {
        document.body.dataset.v73Settings = VERSION;
        document.body.dataset.productionMode = settings.ui.productionMode ? "true" : "false";
        document.body.dataset.workspaceCompactPanels = settings.ui.compactPanels ? "true" : "false";

        if (window.PlatformSettingsStoreV70?.save) {
            window.PlatformSettingsStoreV70.save({
                mode: settings.execution.mode,
                automationDefault: false,
                developerMode: !settings.ui.productionMode
            });
        }

        if (window.WorkspacePersistenceManagerV72?.save) {
            window.WorkspacePersistenceManagerV72.save({
                compactPanels: settings.ui.compactPanels,
                productionMode: settings.ui.productionMode,
                profile: settings.ui.activeProfile
            });
        }
    }

    function wire() {
        window.EventBus?.subscribe?.("unified-settings.updated", applyToExistingSystems);
        applyToExistingSystems(load());
        render();
    }

    window.UnifiedSettingsStoreV73 = {
        load,
        save,
        reset,
        exportJson,
        importJson,
        render,
        applyToExistingSystems,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
