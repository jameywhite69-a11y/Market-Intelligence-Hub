/*
Version 51.2 — Startup Ownership Analyzer
Forensic instrumentation for layout ownership, DOM movement, and bootstrap conflicts.
*/
(function () {
    const VERSION = "51.2";
    const MAX = 5000;
    const rows = [];
    const WATCH_IDS = [
        "tiosLayoutManagerShell",
        "workstation-main-grid",
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
        "startupTracePanel",
        "startupOwnershipPanel"
    ];

    let installed = false;

    function now() {
        return Math.round(performance.now());
    }

    function getStack() {
        try {
            return new Error().stack.split("\n").slice(3, 12).map(x => x.trim()).join("\n");
        } catch {
            return "";
        }
    }

    function describe(node) {
        if (!node) return "";
        if (node === document) return "document";
        if (node === document.body) return "body";
        if (node.id) return "#" + node.id;
        const tag = (node.tagName || node.nodeName || "").toLowerCase();
        const cls = typeof node.className === "string"
            ? node.className.trim().split(/\s+/).slice(0, 4).join(".")
            : "";
        return cls ? tag + "." + cls : tag;
    }

    function relevant(node) {
        if (!node || node.nodeType !== 1) return false;
        if (WATCH_IDS.includes(node.id)) return true;
        const cls = typeof node.className === "string" ? node.className : "";
        if (
            cls.includes("workstation") ||
            cls.includes("institutional-dock") ||
            cls.includes("tios") ||
            cls.includes("runtime")
        ) return true;
        if (node.querySelector) return WATCH_IDS.some(id => node.querySelector("#" + id));
        return false;
    }

    function add(type, detail = {}, withStack = false) {
        const row = { t: now(), type, detail, stack: withStack ? getStack() : undefined };
        rows.push(row);
        if (rows.length > MAX) rows.shift();
        return row;
    }

    function patchMethod(proto, name) {
        if (!proto || !proto[name] || proto[name].__ownershipWrapped) return;
        const original = proto[name];

        proto[name] = function (...args) {
            const watchedTarget = relevant(this);
            const watchedArgs = args.filter(relevant);
            if (watchedTarget || watchedArgs.length) {
                add("dom." + name, {
                    target: describe(this),
                    args: args.map(describe),
                    watchedArgs: watchedArgs.map(describe)
                }, true);
            }
            return original.apply(this, args);
        };

        proto[name].__ownershipWrapped = true;
    }

    function patchInnerHTML() {
        const d = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
        if (!d || !d.set || d.set.__ownershipWrapped) return;
        Object.defineProperty(Element.prototype, "innerHTML", {
            get: d.get,
            set: function (value) {
                if (relevant(this)) {
                    add("dom.innerHTML.set", {
                        target: describe(this),
                        valuePreview: String(value || "").slice(0, 250)
                    }, true);
                }
                return d.set.call(this, value);
            }
        });
    }

    function patchEventBus() {
        const bus = window.EventBus;
        if (!bus || bus.__ownershipWrapped) return false;
        const pub = bus.publish?.bind(bus);
        const sub = bus.subscribe?.bind(bus);

        if (pub) {
            bus.publish = function (eventName, payload) {
                add("eventbus.publish", {
                    eventName,
                    payloadPreview: safePreview(payload)
                }, String(eventName || "").includes("layout"));
                return pub(eventName, payload);
            };
        }

        if (sub) {
            bus.subscribe = function (eventName, handler) {
                add("eventbus.subscribe", { eventName });
                return sub(eventName, handler);
            };
        }

        bus.__ownershipWrapped = true;
        add("eventbus.wrapped");
        return true;
    }

    function safePreview(v) {
        try { return JSON.stringify(v).slice(0, 400); }
        catch { return String(v).slice(0, 400); }
    }

    function observeMutations() {
        if (window.__tiosOwnershipObserver) return;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === "childList") {
                    m.addedNodes.forEach(node => {
                        if (relevant(node)) add("mutation.added", { node: describe(node), parent: describe(m.target) });
                    });
                    m.removedNodes.forEach(node => {
                        if (relevant(node)) add("mutation.removed", { node: describe(node), parent: describe(m.target) });
                    });
                }
                if (m.type === "attributes" && relevant(m.target)) {
                    add("mutation.attribute", {
                        node: describe(m.target),
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

        window.__tiosOwnershipObserver = observer;
        add("mutation.observer.started");
    }

    function panelSnapshot() {
        return WATCH_IDS.map(id => {
            const el = document.getElementById(id);
            return {
                id,
                exists: !!el,
                parent: el ? describe(el.parentElement) : "missing",
                className: el ? String(el.className || "") : "",
                docked: el?.dataset?.docked || "",
                layoutManaged: el?.dataset?.layoutManaged || "",
                layoutRegion: el?.dataset?.layoutRegion || ""
            };
        });
    }

    function moduleStatus() {
        return [
            "InstitutionalDockSystem",
            "TIOSPanelRegistry",
            "TIOSLayoutManager",
            "RuntimeLayoutComposer",
            "ScannerSelectionUnifier",
            "PlatformAssetValidator",
            "WorkstationCompatibilityLayer",
            "ModuleRegistry",
            "EventBus"
        ].map(name => ({ name, type: typeof window[name], present: typeof window[name] !== "undefined" }));
    }

    function detectConflicts() {
        const important = rows.filter(r => {
            const s = safePreview(r);
            return s.includes("tiosLayoutManagerShell") ||
                s.includes("workstation-main-grid") ||
                s.includes("decisionPipelinePanel") ||
                s.includes("institutionalDecisionPackagePanel") ||
                s.includes("scannerResultsBody");
        });

        return {
            importantRows: important.slice(-250),
            missingPanels: panelSnapshot().filter(p => !p.exists),
            managedPanels: [...document.querySelectorAll("[data-layout-managed='true']")].map(el => ({
                id: el.id,
                parent: describe(el.parentElement),
                region: el.dataset.layoutRegion || ""
            }))
        };
    }

    function report() {
        return {
            version: VERSION,
            rows: rows.slice(),
            panels: panelSnapshot(),
            modules: moduleStatus(),
            conflicts: detectConflicts(),
            bodyDataset: { ...document.body.dataset }
        };
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify(report(), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tios_startup_ownership_" + Date.now() + ".json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function install() {
        if (installed) return;
        installed = true;
        add("ownership.install", { version: VERSION }, true);

        patchMethod(Node.prototype, "appendChild");
        patchMethod(Node.prototype, "insertBefore");
        patchMethod(Node.prototype, "removeChild");
        patchMethod(Element.prototype, "replaceChildren");
        patchInnerHTML();
        observeMutations();

        document.addEventListener("DOMContentLoaded", () => add("document.DOMContentLoaded"));
        window.addEventListener("load", () => add("window.load"));

        [250, 600, 1200, 2500, 5000, 8000, 12000].forEach(delay => {
            setTimeout(() => {
                patchEventBus();
                add("snapshot", { panels: panelSnapshot(), modules: moduleStatus() });
            }, delay);
        });
    }

    window.TIOSStartupOwnershipAnalyzer = {
        install,
        report,
        exportJson,
        panelSnapshot,
        moduleStatus,
        detectConflicts,
        rows: () => rows.slice(),
        mark: (label, detail = {}) => add("mark", { label, ...detail }, true)
    };

    install();
})();
