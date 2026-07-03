/*
Version 58.1 — AI Dock Stability Hotfix
Purpose:
- Fix flicker that only occurs when the AI dock tab is active.
- Prevent repeated AI/audit repaint storms inside the right dock.
- Deduplicate identical audit text and throttle AI dock redraws.
- UI only. No broker execution.
*/
(function () {
    const VERSION = "58.1";
    const AI_DOCK_SELECTOR = '[data-dock-panel="ai"]';
    const THROTTLE_MS = 350;

    let lastAiText = "";
    let lastAiHtml = "";
    let lastMutationAt = 0;
    let locked = false;

    function aiPanel() {
        return document.querySelector(AI_DOCK_SELECTOR);
    }

    function isAiActive() {
        const panel = aiPanel();
        return !!panel && panel.classList.contains("active");
    }

    function compactRepeatedAuditText(panel) {
        if (!panel) return;

        const text = panel.innerText || "";
        if (!text || text === lastAiText) return;

        const lines = text.split("\n").map(x => x.trim()).filter(Boolean);
        const compact = [];
        const seen = new Set();

        for (const line of lines) {
            const key = line
                .replace(/\d+:\d+:\d+\s*(AM|PM)?/gi, "")
                .replace(/\s+/g, " ")
                .trim();

            if (seen.has(key)) continue;
            seen.add(key);
            compact.push(line);

            if (compact.length >= 24) break;
        }

        const nextText = compact.join("\n");

        if (compact.length < lines.length && nextText) {
            lastAiText = nextText;
            panel.innerText = nextText;
        } else {
            lastAiText = text;
        }
    }

    function stabilizeAiDock() {
        const panel = aiPanel();
        if (!panel || locked) return;

        const now = performance.now();
        if (now - lastMutationAt < THROTTLE_MS) return;

        lastMutationAt = now;
        locked = true;

        requestAnimationFrame(() => {
            try {
                compactRepeatedAuditText(panel);

                const html = panel.innerHTML;
                if (html === lastAiHtml) {
                    locked = false;
                    return;
                }

                lastAiHtml = html;
                panel.dataset.aiDockStable = VERSION;
            } finally {
                setTimeout(() => {
                    locked = false;
                }, 50);
            }
        });
    }

    function observeAiDock() {
        const panel = aiPanel();
        if (!panel || panel.dataset.v581Observed === "true") return;

        panel.dataset.v581Observed = "true";

        const observer = new MutationObserver(() => {
            if (!isAiActive()) return;
            stabilizeAiDock();
        });

        observer.observe(panel, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    function patchAuditPublish() {
        if (!window.EventBus || typeof window.EventBus.publish !== "function") {
            setTimeout(patchAuditPublish, 200);
            return;
        }

        if (window.EventBus.__v581AiDockPatch === true) return;

        const originalPublish = window.EventBus.publish.bind(window.EventBus);
        const recent = new Map();

        window.EventBus.publish = function aiDockStablePublish(eventName, payload) {
            const aiAuditEvent =
                eventName.includes("audit") ||
                eventName.includes("decision-package") ||
                eventName.includes("decision-stage") ||
                eventName === "institutional-decision.updated" ||
                eventName === "decision.updated";

            if (isAiActive() && aiAuditEvent) {
                const key = eventName + ":" + JSON.stringify(payload?.value || payload || {});
                const now = performance.now();
                const last = recent.get(key) || 0;

                if (now - last < THROTTLE_MS) {
                    return false;
                }

                recent.set(key, now);
            }

            return originalPublish(eventName, payload);
        };

        window.EventBus.__v581AiDockPatch = true;
    }

    function freezeAiDockDuringOpportunityClick() {
        document.addEventListener("click", event => {
            if (!isAiActive()) return;

            const target = event.target;
            const opportunityClick = target.closest?.(
                ".opportunity-card, .v56-result-row, #opportunityQueue, #scannerResultsBody, #opportunityHeatmap, #institutionalHeatmapV56Panel, [data-symbol]"
            );

            if (!opportunityClick) return;

            const panel = aiPanel();
            if (!panel) return;

            panel.classList.add("ai-dock-updating");
            setTimeout(() => panel.classList.remove("ai-dock-updating"), 300);
        }, true);
    }

    function init() {
        patchAuditPublish();
        observeAiDock();
        freezeAiDockDuringOpportunityClick();

        document.body.dataset.aiDockStability = VERSION;
        console.log("[TIOS AI Dock Stability]", { version: VERSION });

        setInterval(observeAiDock, 1000);
    }

    window.AIDockStabilityControllerV581 = {
        init,
        stabilizeAiDock,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1200));
})();
