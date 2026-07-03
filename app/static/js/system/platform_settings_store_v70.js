/*
Version 70.0 — Platform Settings Store
Local settings only. No credentials stored.
*/
(function () {
    const VERSION = "70.0";
    const KEY = "mih.tios.platform.settings.v70";

    const defaults = {
        mode: "paper",
        developerMode: false,
        automationDefault: false,
        theme: "institutional-dark",
        releaseChannel: "candidate"
    };

    function load() {
        try {
            return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
        } catch {
            return { ...defaults };
        }
    }

    function save(settings) {
        const next = { ...load(), ...settings };
        localStorage.setItem(KEY, JSON.stringify(next));
        window.EventBus?.publish?.("platform-settings.updated", next);
        render();
        return next;
    }

    function render() {
        const panel = document.getElementById("platformSettingsPanelV70");
        if (!panel) return;

        const s = load();

        panel.innerHTML = `
            <section class="v70-card">
                <div class="v70-header">
                    <div>
                        <h2>Platform Settings</h2>
                        <span>local release-candidate settings</span>
                    </div>
                    <strong>${s.mode.toUpperCase()}</strong>
                </div>

                <div class="v70-settings-grid">
                    <div><small>Mode</small><b>${s.mode}</b></div>
                    <div><small>Developer</small><b>${s.developerMode ? "on" : "off"}</b></div>
                    <div><small>Automation</small><b>${s.automationDefault ? "default on" : "manual"}</b></div>
                    <div><small>Channel</small><b>${s.releaseChannel}</b></div>
                </div>

                <div class="v70-action-row">
                    <button id="v70PaperMode">Paper Mode</button>
                    <button id="v70ToggleDeveloper">Toggle Developer</button>
                    <button id="v70ResetSettings">Reset</button>
                </div>
            </section>
        `;

        document.getElementById("v70PaperMode")?.addEventListener("click", () => save({ mode: "paper" }));
        document.getElementById("v70ToggleDeveloper")?.addEventListener("click", () => save({ developerMode: !load().developerMode }));
        document.getElementById("v70ResetSettings")?.addEventListener("click", () => {
            localStorage.removeItem(KEY);
            render();
        });
    }

    window.PlatformSettingsStoreV70 = { load, save, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1600));
})();
