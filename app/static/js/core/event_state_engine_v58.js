/*
Version 58.0 — Event Bus & State Engine Refactor
Purpose:
- Stop duplicate event storms.
- Prevent right dock flicker caused by repeated identical decision/audit events.
- Create one stable event-state cache for panels to subscribe to.
- UI/state only. No broker execution.
*/
(function () {
    const VERSION = "58.0";
    const DEFAULT_THROTTLE_MS = 220;

    const IMPORTANT_EVENTS = new Set([
        "scanner.selection.changed",
        "scanner.results.updated",
        "unified-opportunity.changed",
        "institutional-decision.updated",
        "decision.updated",
        "decision-package.updated",
        "decision-stage-pipeline.updated",
        "institutional-decision-package.updated",
        "institutional-decision-audit.updated",
        "store.changed"
    ]);

    const state = {
        latest: new Map(),
        hashes: new Map(),
        timestamps: new Map(),
        suppressed: new Map(),
        subscribers: new Map()
    };

    function stableStringify(value) {
        const seen = new WeakSet();

        function normalize(obj) {
            if (obj === null || typeof obj !== "object") return obj;
            if (seen.has(obj)) return "[Circular]";
            seen.add(obj);

            if (Array.isArray(obj)) return obj.map(normalize);

            return Object.keys(obj)
                .sort()
                .reduce((acc, key) => {
                    if (typeof obj[key] !== "function") {
                        acc[key] = normalize(obj[key]);
                    }
                    return acc;
                }, {});
        }

        try {
            return JSON.stringify(normalize(value));
        } catch {
            return String(value);
        }
    }

    function hashPayload(eventName, payload) {
        const normalized = payload?.value || payload || {};
        return `${eventName}:${stableStringify(normalized)}`;
    }

    function shouldSuppress(eventName, payload) {
        if (!IMPORTANT_EVENTS.has(eventName)) return false;

        const now = performance.now();
        const hash = hashPayload(eventName, payload);
        const lastHash = state.hashes.get(eventName);
        const lastTime = state.timestamps.get(eventName) || 0;

        if (hash === lastHash && now - lastTime < DEFAULT_THROTTLE_MS) {
            state.suppressed.set(eventName, (state.suppressed.get(eventName) || 0) + 1);
            return true;
        }

        state.hashes.set(eventName, hash);
        state.timestamps.set(eventName, now);
        state.latest.set(eventName, payload);
        return false;
    }

    function notifyStateSubscribers(eventName, payload) {
        const subs = state.subscribers.get(eventName);
        if (!subs) return;

        subs.forEach(fn => {
            try {
                fn(payload, eventName);
            } catch (error) {
                console.warn("[TIOS State Engine subscriber error]", eventName, error);
            }
        });
    }

    function patchEventBus() {
        if (!window.EventBus || typeof window.EventBus.publish !== "function") {
            setTimeout(patchEventBus, 200);
            return;
        }

        if (window.EventBus.__v58StateEngine === true) return;

        const originalPublish = window.EventBus.publish.bind(window.EventBus);

        window.EventBus.publish = function v58Publish(eventName, payload) {
            if (shouldSuppress(eventName, payload)) {
                return false;
            }

            const result = originalPublish(eventName, payload);
            notifyStateSubscribers(eventName, payload);
            return result;
        };

        window.EventBus.__v58StateEngine = true;
        console.log("[TIOS Event State Engine]", { version: VERSION, patched: true });
    }

    function subscribe(eventName, fn) {
        if (!state.subscribers.has(eventName)) {
            state.subscribers.set(eventName, new Set());
        }

        state.subscribers.get(eventName).add(fn);

        return function unsubscribe() {
            state.subscribers.get(eventName)?.delete(fn);
        };
    }

    function get(eventName) {
        return state.latest.get(eventName);
    }

    function report() {
        return {
            version: VERSION,
            events: Array.from(state.latest.keys()),
            suppressed: Object.fromEntries(state.suppressed.entries()),
            hashes: Array.from(state.hashes.keys()),
            patched: !!window.EventBus?.__v58StateEngine
        };
    }

    function protectAuditPanel() {
        const panel = document.getElementById("institutionalDecisionAuditPanelV48")
            || document.getElementById("decisionAuditTrailPanel");

        if (!panel) return;

        panel.dataset.v58AuditProtected = "true";

        let lastText = "";
        const observer = new MutationObserver(() => {
            const text = panel.innerText || "";
            if (text === lastText) return;

            const lines = text.split("\n");
            const compact = [];
            const seen = new Set();

            for (const line of lines) {
                const key = line.trim();
                if (!key) continue;
                if (seen.has(key)) continue;
                seen.add(key);
                compact.push(line);
                if (compact.length >= 35) break;
            }

            const nextText = compact.join("\n");
            if (nextText && nextText !== text && compact.length < lines.length) {
                lastText = nextText;
                panel.innerText = nextText;
            } else {
                lastText = text;
            }
        });

        observer.observe(panel, { childList: true, subtree: true, characterData: true });
    }

    function init() {
        patchEventBus();
        protectAuditPanel();
        document.body.dataset.eventStateEngine = VERSION;
    }

    window.TIOSEventStateEngineV58 = {
        init,
        subscribe,
        get,
        report,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 200));
})();
