function safeElement(id) {
    return document.getElementById(id);
}

function noopElement(id) {
    const element = document.createElement("div");
    element.id = id;
    element.dataset.compatibilityPlaceholder = "true";
    element.style.display = "none";
    document.body.appendChild(element);
    return element;
}

function ensureElement(id) {
    return safeElement(id) || noopElement(id);
}

const scannerDom = {
    symbolsInput: ensureElement("symbolsInput"),
    timeframesInput: ensureElement("timeframesInput"),
    indicatorsInput: ensureElement("indicatorsInput"),
    runButton: ensureElement("runScanButton"),
    exportButton: ensureElement("exportCsvButton"),
    resultsBody: ensureElement("scannerResultsBody"),
    resultCount: ensureElement("resultCount"),
    status: ensureElement("scanStatus"),
    diagnosticsPanel: ensureElement("scannerDiagnostics"),
    opportunityPanel: ensureElement("opportunityPanel"),
    minScoreInput: ensureElement("minScoreInput"),
    gradeFilterSelect: ensureElement("gradeFilterSelect"),
    confidenceFilterSelect: ensureElement("confidenceFilterSelect"),
    liveModeButton: ensureElement("liveModeButton"),
    pauseLiveButton: ensureElement("pauseLiveButton"),
    refreshIntervalSelect: ensureElement("refreshIntervalSelect"),
    countdownLabel: ensureElement("countdownLabel"),
    lastScanLabel: ensureElement("lastScanLabel"),

    watchlistSelect: ensureElement("watchlistSelect"),
    newWatchlistName: ensureElement("newWatchlistName"),
    createWatchlistButton: ensureElement("createWatchlistButton"),
    deleteWatchlistButton: ensureElement("deleteWatchlistButton"),
    addSymbolInput: ensureElement("addSymbolInput"),
    addSymbolButton: ensureElement("addSymbolButton"),
    watchlistSymbols: ensureElement("watchlistSymbols"),
    importSymbolsInput: ensureElement("importSymbolsInput"),
    exportWatchlistButton: ensureElement("exportWatchlistButton"),
};

window.scannerDom = scannerDom;
