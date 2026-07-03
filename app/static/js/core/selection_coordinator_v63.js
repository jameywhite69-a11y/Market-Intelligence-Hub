/*
Version 63.0 — Selection Coordinator
Routes all opportunity clicks into MarketContextStoreV63.
*/
(function () {
    const VERSION = "63.0";

    function findSymbolElement(target) {
        return target.closest?.("[data-symbol], .v56-result-row, .v59-queue-row, .v61-rs-list button, #opportunityQueue button");
    }

    function findOpportunity(symbol) {
        if (!symbol) return null;
        return (window.TIOSInstitutionalScannerV56?.latest || []).find(x => x.symbol === symbol) || null;
    }

    function handleClick(event) {
        const el = findSymbolElement(event.target);
        if (!el) return;

        const symbol = el.dataset.symbol;
        const found = findOpportunity(symbol);
        if (!found) return;

        window.MarketContextStoreV63?.setSelected?.(found, "coordinated-click");
    }

    function init() {
        document.addEventListener("click", handleClick, true);
        document.body.dataset.selectionCoordinator = VERSION;
        console.log("[SelectionCoordinatorV63]", { version: VERSION });
    }

    window.SelectionCoordinatorV63 = { init, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1200));
})();
