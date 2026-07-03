/*
Version 59.0 — Institutional Decision Queue
Creates a ranked execution queue from scanner candidates.
*/
(function () {
    const VERSION = "59.0";

    function candidates() {
        return window.TIOSInstitutionalScannerV56?.latest || [];
    }

    function status(c) {
        if (c.score >= 92 && c.risk <= 45) return "EXECUTE";
        if (c.score >= 84) return "WATCH";
        if (c.score >= 72) return "WAIT";
        return "AVOID";
    }

    function render(list = candidates()) {
        const panel = document.getElementById("institutionalDecisionQueuePanel");
        if (!panel) return;

        const rows = list.slice(0, 10);

        panel.innerHTML = `
            <section class="v59-queue-card">
                <div class="v59-header">
                    <div>
                        <h2>Institutional Decision Queue</h2>
                        <span>${rows.length} ranked opportunities</span>
                    </div>
                    <strong>LIVE</strong>
                </div>

                <div class="v59-queue-list">
                    ${rows.map(c => `
                        <button class="v59-queue-row" data-symbol="${c.symbol}">
                            <b>#${c.rank || ""} ${c.symbol}</b>
                            <span>${c.score?.toFixed ? c.score.toFixed(1) : c.score}</span>
                            <em>${status(c)}</em>
                        </button>
                    `).join("") || "<div class='v59-empty'>Run scan to build queue</div>"}
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-symbol]").forEach(btn => {
            btn.addEventListener("click", () => {
                const found = rows.find(r => r.symbol === btn.dataset.symbol);
                if (found) {
                    window.EventBus?.publish?.("scanner.selection.changed", found);
                    window.EventBus?.publish?.("unified-opportunity.changed", { key: "v59-queue", value: found });
                }
            });
        });
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => render(payload?.results || candidates()));
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", () => render());
        setTimeout(() => render(), 1500);
    }

    window.InstitutionalDecisionQueueV59 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 900));
})();
