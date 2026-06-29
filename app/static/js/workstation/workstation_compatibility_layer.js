/*
Version 31.2 — Workstation Compatibility Layer

Purpose:
Bridge older scanner modules and the new Professional Trading Workstation shell.
This file must load AFTER scanner modules and BEFORE scanner_orchestrator.js.
*/

(function () {
    function byId(id) {
        return document.getElementById(id);
    }

    function ensureInputLike(id, defaultValue = "") {
        let element = byId(id);

        if (!element) {
            element = document.createElement("input");
            element.id = id;
            element.value = defaultValue;
            element.dataset.compatibilityPlaceholder = "true";
            element.style.display = "none";
            document.body.appendChild(element);
        }

        if (typeof element.value === "undefined") {
            element.value = defaultValue;
        }

        return element;
    }

    function ensureContainer(id) {
        let element = byId(id);

        if (!element) {
            element = document.createElement("section");
            element.id = id;
            element.dataset.compatibilityPlaceholder = "true";
            element.style.display = "none";
            document.body.appendChild(element);
        }

        return element;
    }

    function ensureButton(id) {
        let element = byId(id);

        if (!element) {
            element = document.createElement("button");
            element.id = id;
            element.dataset.compatibilityPlaceholder = "true";
            element.style.display = "none";
            document.body.appendChild(element);
        }

        return element;
    }

    function ensureWorkstationDom() {
        ensureInputLike("symbolsInput", "BTC,ETH,SOL");
        ensureInputLike("timeframesInput", "15m,1h");
        ensureInputLike("indicatorsInput", "SMA,EMA,VWMA");
        ensureInputLike("minScoreInput", "0");
        ensureInputLike("newWatchlistName", "");
        ensureInputLike("addSymbolInput", "");
        ensureInputLike("importSymbolsInput", "");

        ensureContainer("watchlistSelect");
        ensureContainer("watchlistSymbols");
        ensureContainer("scannerResultsBody");
        ensureContainer("resultCount");
        ensureContainer("scanStatus");
        ensureContainer("scannerDiagnostics");
        ensureContainer("opportunityPanel");
        ensureContainer("countdownLabel");
        ensureContainer("lastScanLabel");
        ensureContainer("portfolioSummaryCards");
        ensureContainer("workspaceProfiles");
        ensureContainer("multiWatchlistDashboard");
        ensureContainer("opportunityHeatmap");
        ensureContainer("opportunityQueue");
        ensureContainer("opportunityHistory");
        ensureContainer("paperTradingPanel");

        ensureButton("runScanButton");
        ensureButton("exportCsvButton");
        ensureButton("createWatchlistButton");
        ensureButton("deleteWatchlistButton");
        ensureButton("addSymbolButton");
        ensureButton("exportWatchlistButton");
        ensureButton("liveModeButton");
        ensureButton("pauseLiveButton");

        if (!window.scannerDom) {
            window.scannerDom = {};
        }

        Object.assign(window.scannerDom, {
            symbolsInput: byId("symbolsInput"),
            timeframesInput: byId("timeframesInput"),
            indicatorsInput: byId("indicatorsInput"),
            runButton: byId("runScanButton"),
            exportButton: byId("exportCsvButton"),
            resultsBody: byId("scannerResultsBody"),
            resultCount: byId("resultCount"),
            status: byId("scanStatus"),
            diagnosticsPanel: byId("scannerDiagnostics"),
            opportunityPanel: byId("opportunityPanel"),
            minScoreInput: byId("minScoreInput"),
            gradeFilterSelect: byId("gradeFilterSelect"),
            confidenceFilterSelect: byId("confidenceFilterSelect"),
            liveModeButton: byId("liveModeButton"),
            pauseLiveButton: byId("pauseLiveButton"),
            refreshIntervalSelect: byId("refreshIntervalSelect"),
            countdownLabel: byId("countdownLabel"),
            lastScanLabel: byId("lastScanLabel"),
            watchlistSelect: byId("watchlistSelect"),
            newWatchlistName: byId("newWatchlistName"),
            createWatchlistButton: byId("createWatchlistButton"),
            deleteWatchlistButton: byId("deleteWatchlistButton"),
            addSymbolInput: byId("addSymbolInput"),
            addSymbolButton: byId("addSymbolButton"),
            watchlistSymbols: byId("watchlistSymbols"),
            importSymbolsInput: byId("importSymbolsInput"),
            exportWatchlistButton: byId("exportWatchlistButton"),
        });
    }

    function patchScannerStatus() {
        window.scannerStatus = window.scannerStatus || {};

        const set = (message) => {
            const status = byId("scanStatus");
            if (status) status.textContent = message;
        };

        const setLast = (message) => {
            const label = byId("lastScanLabel");
            if (label) label.textContent = message;
        };

        const setCountdown = (message) => {
            const label = byId("countdownLabel");
            if (label) label.textContent = message;
        };

        const names = [
            "setStatus",
            "setScanStatus",
            "setScannerStatus",
            "setReady",
            "setScanning",
            "setRunning",
            "setLoading",
            "setCompleted",
            "setComplete",
            "setError",
            "setPaused",
        ];

        for (const name of names) {
            if (typeof window.scannerStatus[name] !== "function") {
                window.scannerStatus[name] = set;
            }
        }

        if (typeof window.scannerStatus.setLastScanLabel !== "function") {
            window.scannerStatus.setLastScanLabel = setLast;
        }

        if (typeof window.scannerStatus.setCountdown !== "function") {
            window.scannerStatus.setCountdown = setCountdown;
        }
    }

    function patchWatchlistManager() {
        window.watchlistManager = window.watchlistManager || {};

        const wm = window.watchlistManager;

        const bootstrap = async () => {
            if (typeof wm.bootstrapWatchlists === "function") return await wm.bootstrapWatchlists();
            if (typeof wm.loadWatchlists === "function") return await wm.loadWatchlists();
            return null;
        };

        if (typeof wm.bindWatchlistView !== "function") {
            wm.bindWatchlistView = bootstrap;
        }

        if (typeof wm.renderWatchlistView !== "function") {
            wm.renderWatchlistView = async () => {
                if (typeof wm.renderWatchlistSelect === "function") wm.renderWatchlistSelect();
                if (typeof wm.renderWatchlistSymbols === "function") wm.renderWatchlistSymbols();
            };
        }

        if (typeof wm.refreshWatchlists !== "function") {
            wm.refreshWatchlists = async () => {
                if (typeof wm.loadWatchlists === "function") return await wm.loadWatchlists();
                return await bootstrap();
            };
        }

        if (typeof wm.load !== "function") wm.load = bootstrap;
        if (typeof wm.bootstrap !== "function") wm.bootstrap = bootstrap;
    }

    function patchPaperTrading() {
        window.paperTradingPanel = window.paperTradingPanel || {};

        if (typeof window.paperTradingPanel.renderPaperTradingPanel !== "function") {
            window.paperTradingPanel.renderPaperTradingPanel = async () => {};
        }

        if (typeof window.paperTradingPanel.submitPaperOrderFromResult !== "function") {
            window.paperTradingPanel.submitPaperOrderFromResult = async () => {};
        }
    }

    function patchOpportunityPanel() {
        window.opportunityPanel = window.opportunityPanel || {};

        if (typeof window.opportunityPanel.clearOpportunityPanel !== "function") {
            window.opportunityPanel.clearOpportunityPanel = () => {};
        }

        if (typeof window.opportunityPanel.renderOpportunityPanel !== "function") {
            window.opportunityPanel.renderOpportunityPanel = async () => {};
        }
    }

    function applyCompatibilityLayer() {
        ensureWorkstationDom();
        patchScannerStatus();
        patchWatchlistManager();
        patchPaperTrading();
        patchOpportunityPanel();

        window.workstationCompatibilityReady = true;
        console.info("Workstation compatibility layer ready");
    }

    applyCompatibilityLayer();

    window.workstationCompatibilityLayer = {
        applyCompatibilityLayer,
        ensureWorkstationDom,
        patchScannerStatus,
        patchWatchlistManager,
        patchPaperTrading,
        patchOpportunityPanel,
    };
})();
