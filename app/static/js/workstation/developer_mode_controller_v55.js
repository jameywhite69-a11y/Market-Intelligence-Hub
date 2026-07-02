/*
Version 55.0 — Developer Mode Controller
Hides startup / ownership diagnostics by default and exposes them only when Developer Mode is enabled.
*/
(function () {
    const VERSION = "55.0";
    const KEY = "tios.developerMode.enabled";

    const DIAGNOSTIC_IDS = [
        "startupTracePanel",
        "startupOwnershipPanel",
        "tiosLayoutManagerPanel"
    ];

    function enabled() {
        return localStorage.getItem(KEY) === "true";
    }

    function setEnabled(value) {
        localStorage.setItem(KEY, value ? "true" : "false");
        apply();
        window.EventBus?.publish?.("developer-mode.changed", {
            enabled: value,
            version: VERSION
        });
    }

    function apply() {
        const on = enabled();

        document.body.dataset.developerMode = on ? "on" : "off";

        DIAGNOSTIC_IDS.forEach(id => {
            const panel = document.getElementById(id);
            if (!panel) return;
            panel.classList.toggle("developer-hidden", !on);
            panel.dataset.developerOnly = "true";
        });

        const button = document.getElementById("developerModeToggle");
        if (button) {
            button.textContent = on ? "Developer: ON" : "Developer: OFF";
            button.classList.toggle("active", on);
        }

        return on;
    }

    function ensureToggle() {
        if (document.getElementById("developerModeToggle")) return;

        const rightDock = document.querySelector(".native-tios-right") || document.querySelector(".workstation-right-dock");
        if (!rightDock) return;

        const wrap = document.createElement("section");
        wrap.className = "developer-mode-strip";
        wrap.innerHTML = `
            <button id="developerModeToggle" class="secondary-button" type="button">Developer: OFF</button>
        `;

        rightDock.insertBefore(wrap, rightDock.firstChild);

        document.getElementById("developerModeToggle")?.addEventListener("click", () => {
            setEnabled(!enabled());
        });
    }

    function init() {
        ensureToggle();
        apply();
        console.log("[TIOS Developer Mode]", { version: VERSION, enabled: enabled() });
    }

    window.DeveloperModeControllerV55 = {
        init,
        enabled,
        setEnabled,
        apply,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 700));
})();
