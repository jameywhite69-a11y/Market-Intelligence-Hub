/*
Version 57.1 — UI Event Stability Hotfix
Prevents duplicate rapid-fire opportunity events and keeps V56 from hijacking the legacy top heatmap.
*/
(function () {
    const VERSION = "57.1";
    const DUPLICATE_WINDOW_MS = 180;
    const EVENT_NAMES = new Set([
        "scanner.selection.changed",
        "scanner.results.updated",
        "unified-opportunity.changed",
        "decision.updated",
        "institutional-decision.updated"
    ]);

    const last = new Map();

    function signature(eventName, payload) {
        const value = payload?.value || payload || {};
        const symbol = value.symbol || payload?.symbol || "";
        const timeframe = value.timeframe || payload?.timeframe || "";
        const score = value.score || value.opportunityScore || value.validationScore || "";
        const decision = value.decision || "";
        const resultsLength = Array.isArray(payload?.results) ? payload.results.length : "";
        return `${eventName}|${symbol}|${timeframe}|${score}|${decision}|${resultsLength}`;
    }

    function wrapEventBus() {
        if (!window.EventBus || typeof window.EventBus.publish !== "function") {
            setTimeout(wrapEventBus, 200);
            return;
        }

        if (window.EventBus.__v57Stabilized === true) return;

        const originalPublish = window.EventBus.publish.bind(window.EventBus);

        window.EventBus.publish = function stabilizedPublish(eventName, payload) {
            if (EVENT_NAMES.has(eventName)) {
                const now = performance.now();
                const sig = signature(eventName, payload);
                const previous = last.get(sig);

                if (previous && now - previous < DUPLICATE_WINDOW_MS) {
                    return false;
                }

                last.set(sig, now);
            }

            return originalPublish(eventName, payload);
        };

        window.EventBus.__v57Stabilized = true;
        console.log("[TIOS Event Stabilizer]", { version: VERSION, active: true });
    }

    function protectTopHeatmap() {
        const topHeatmap = document.getElementById("opportunityHeatmap");
        if (!topHeatmap) return;

        topHeatmap.dataset.owner = "legacy-opportunity-heatmap";
        topHeatmap.dataset.lockedAgainstV56 = "true";

        const observer = new MutationObserver(() => {
            const v56InsideTop = topHeatmap.querySelector(".v56-heatmap-card");
            if (!v56InsideTop) return;

            const target = document.getElementById("institutionalHeatmapV56Panel");
            if (target) {
                target.innerHTML = "";
                target.appendChild(v56InsideTop);
            }
        });

        observer.observe(topHeatmap, { childList: true, subtree: true });
    }

    function init() {
        wrapEventBus();
        protectTopHeatmap();
        document.body.dataset.tiosStabilityHotfix = VERSION;
    }

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 250));

    window.TIOSEventStabilizerV571 = { init, version: VERSION };
})();
