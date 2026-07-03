/*
Version 61.0 — Market Breadth Panel
Summarizes broad candidate quality and participation.
*/
(function () {
    const VERSION = "61.0";

    function summarize(list) {
        list = list || window.TIOSInstitutionalScannerV56?.latest || [];
        const total = list.length || 1;
        const aPlus = list.filter(x => x.grade === "A+").length;
        const tradable = list.filter(x => Number(x.score || 0) >= 84).length;
        const watch = list.filter(x => Number(x.score || 0) >= 72 && Number(x.score || 0) < 84).length;
        const avoid = list.filter(x => Number(x.score || 0) < 72).length;
        const participation = ((aPlus + tradable + watch) / total) * 100;

        return { total, aPlus, tradable, watch, avoid, participation };
    }

    function render(summary = summarize()) {
        const panel = document.getElementById("marketBreadthPanelV61");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v61-breadth-card">
                <div class="v61-header">
                    <div>
                        <h2>Market Breadth</h2>
                        <span>participation across current scan</span>
                    </div>
                    <strong>${summary.participation.toFixed(0)}%</strong>
                </div>

                <div class="v61-breadth-grid">
                    <div><small>A+ Elite</small><b>${summary.aPlus}</b></div>
                    <div><small>Tradable</small><b>${summary.tradable}</b></div>
                    <div><small>Watch</small><b>${summary.watch}</b></div>
                    <div><small>Avoid</small><b>${summary.avoid}</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => render(summarize(payload?.results || [])));
        setTimeout(() => render(), 1700);
    }

    window.MarketBreadthPanelV61 = { summarize, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
