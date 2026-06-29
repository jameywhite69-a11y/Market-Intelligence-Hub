/*
Version 33.0 — DOM Registry

A single safe access layer for UI elements. Modules should use DOMRegistry.get()
instead of assuming document.getElementById(...) always returns an element.
*/

(function () {
    const registry = new Map();

    function createPlaceholder(id, type = "div") {
        const element = document.createElement(type);
        element.id = id;
        element.dataset.domRegistryPlaceholder = "true";
        element.style.display = "none";
        document.body.appendChild(element);
        return element;
    }

    function register(id, options = {}) {
        const type = options.type || "div";
        const required = options.required !== false;
        const fallbackValue = options.value || "";

        let element = document.getElementById(id);

        if (!element && required) {
            element = createPlaceholder(id, type);
        }

        if (element && type === "input" && typeof element.value === "undefined") {
            element.value = fallbackValue;
        }

        registry.set(id, {
            id,
            type,
            required,
            element,
            found: Boolean(element && element.dataset.domRegistryPlaceholder !== "true"),
            placeholder: Boolean(element?.dataset?.domRegistryPlaceholder),
        });

        return element;
    }

    function get(id) {
        const record = registry.get(id);
        if (record?.element) return record.element;

        const element = document.getElementById(id);
        if (element) {
            registry.set(id, {
                id,
                type: element.tagName.toLowerCase(),
                required: true,
                element,
                found: true,
                placeholder: false,
            });
            return element;
        }

        return register(id);
    }

    function setText(id, value) {
        const element = get(id);
        if (element) element.textContent = value ?? "";
    }

    function setHtml(id, value) {
        const element = get(id);
        if (element) element.innerHTML = value ?? "";
    }

    function setValue(id, value) {
        const element = get(id);
        if (element) element.value = value ?? "";
    }

    function value(id, fallback = "") {
        const element = get(id);
        return element?.value ?? fallback;
    }

    function status() {
        return Array.from(registry.values()).map(record => ({
            id: record.id,
            found: record.found,
            placeholder: record.placeholder,
            type: record.type,
        }));
    }

    function registerScannerElements() {
        const inputs = [
            "symbolsInput",
            "timeframesInput",
            "indicatorsInput",
            "minScoreInput",
            "newWatchlistName",
            "addSymbolInput",
            "importSymbolsInput",
        ];

        for (const id of inputs) register(id, { type: "input" });

        const buttons = [
            "runScanButton",
            "exportCsvButton",
            "createWatchlistButton",
            "deleteWatchlistButton",
            "addSymbolButton",
            "exportWatchlistButton",
            "liveModeButton",
            "pauseLiveButton",
        ];

        for (const id of buttons) register(id, { type: "button" });

        const containers = [
            "watchlistSelect",
            "watchlistSymbols",
            "scannerResultsBody",
            "resultCount",
            "scanStatus",
            "scannerDiagnostics",
            "opportunityPanel",
            "countdownLabel",
            "lastScanLabel",
            "portfolioSummaryCards",
            "workspaceProfiles",
            "multiWatchlistDashboard",
            "opportunityHeatmap",
            "opportunityQueue",
            "opportunityHistory",
            "paperTradingPanel",
            "tradingTerminalPanel",
            "workstationExecutionRibbon",
            "gradeFilterSelect",
            "confidenceFilterSelect",
            "refreshIntervalSelect",
        ];

        for (const id of containers) register(id);
    }

    window.DOMRegistry = {
        register,
        get,
        setText,
        setHtml,
        setValue,
        value,
        status,
        registerScannerElements,
    };
})();
