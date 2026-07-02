/*
Version 51.1 — Core Startup Trace
Non-invasive trace engine for startup, layout, EventBus, and panel movement.
*/
(function () {
    const KEY = "tios.startup.trace.v51_1";
    const MAX = 2000;
    const rows = [];
    const watchedIds = [
        "decisionPipelinePanel",
        "institutionalDecisionPackagePanel",
        "institutionalDecisionCardPanel",
        "institutionalIntelligencePanel",
        "decisionStagePipelinePanel",
        "opportunityHeatmap",
        "opportunityQueue",
        "scannerResultsBody",
        "workspaceContextPanel",
        "moduleRegistryPanel",
        "startupTracePanel"
    ];

    function now() { return Math.round(performance.now()); }

    function describeNode(node) {
        if (!node || !node.nodeType) return "";
        if (node.id) return `#${node.id}`;
        const cls = typeof node.className === "string" ? node.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
        return `${(node.tagName || node.nodeName || "").toLowerCase()}${cls ? "." + cls : ""}`;
    }

    function preview(value) {
        try { return JSON.stringify(value).slice(0, 300); }
        catch { return String(value).slice(0, 300); }
    }

    function push(type, detail = {}) {
        const row = { t: now(), type, detail };
        rows.push(row);
        if (rows.length > MAX) rows.shift();
        try { sessionStorage.setItem(KEY, JSON.stringify(rows)); } catch {}
        return row;
    }

    function isRelevant(node) {
        if (!node || node.nodeType !== 1) return false;
        if (watchedIds.includes(node.id)) return true;
        if (node.querySelector && watchedIds.some(id => node.querySelector(`#${id}`))) return true;
        const cls = typeof node.className === "string" ? node.className : "";
        return cls.includes("workstation") || cls.includes("institutional-dock") || cls.includes("tios") || cls.includes("runtime");
    }

    function panelSnapshot() {
        return watchedIds.map(id => {
            const el = document.getElementById(id);
            return {
                id,
                exists: !!el,
                parent: el ? describeNode(el.parentElement) : "missing",
                className: el ? el.className : "",
                docked: el?.dataset?.docked || "",
                layoutManaged: el?.dataset?.layoutManaged || "",
                layoutRegion: el?.dataset?.layoutRegion || ""
            };
        });
    }

    function observeDom() {
        if (window.__tiosStartupTraceObserver) return true;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === "childList") {
                    m.addedNodes.forEach(node => {
                        if (isRelevant(node)) push("dom.added", { target: describeNode(node), parent: describeNode(m.target) });
                    });
                    m.removedNodes.forEach(node => {
                        if (isRelevant(node)) push("dom.removed", { target: describeNode(node), parent: describeNode(m.target) });
                    });
                } else if (m.type === "attributes" && isRelevant(m.target)) {
                    push("dom.attribute", {
                        target: describeNode(m.target),
                        attributeName: m.attributeName,
                        value: m.target.getAttribute(m.attributeName)
                    });
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "style", "data-docked", "data-layout-managed", "data-layout-region"]
        });
        window.__tiosStartupTraceObserver = observer;
        push("dom.observer.started");
        return true;
    }

    function wrapEventBus() {
        const bus = window.EventBus;
        if (!bus || bus.__startupTraceWrapped) return false;
        const originalPublish = bus.publish?.bind(bus);
        const originalSubscribe = bus.subscribe?.bind(bus);

        if (originalPublish) {
            bus.publish = function (eventName, payload) {
                push("eventbus.publish", { eventName, payloadPreview: preview(payload) });
                return originalPublish(eventName, payload);
            };
        }

        if (originalSubscribe) {
            bus.subscribe = function (eventName, handler) {
                push("eventbus.subscribe", { eventName });
                return originalSubscribe(eventName, handler);
            };
        }

        bus.__startupTraceWrapped = true;
        push("eventbus.wrapped");
        return true;
    }

    function mark(label, detail = {}) { return push("mark", { label, ...detail }); }

    function report() {
        return {
            rows: rows.slice(),
            panels: panelSnapshot(),
            eventBusWrapped: !!window.EventBus?.__startupTraceWrapped,
            layoutManager: document.body.dataset.tiosLayoutManager || "",
            runtimeComposer: document.body.dataset.runtimeLayoutComposer || ""
        };
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify(report(), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tios_startup_trace_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function boot() {
        push("trace.boot");
        observeDom();
        wrapEventBus();
        document.addEventListener("DOMContentLoaded", () => push("document.DOMContentLoaded"));
        window.addEventListener("load", () => push("window.load"));
        [500, 1200, 2500, 5000, 8000].forEach(delay => {
            setTimeout(() => push("panel.snapshot", { panels: panelSnapshot() }), delay);
        });
    }

    window.TIOSStartupTrace = { mark, report, exportJson, panelSnapshot, rows: () => rows.slice(), wrapEventBus, observeDom };
    boot();
})();
