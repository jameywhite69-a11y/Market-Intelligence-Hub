/*
Version 55.0 — Opportunity Heatmap Terminal
Adds rich ranked terminal fallback to opportunity heatmap if existing module is quiet.
*/
(function () {
    function rows() {
        const current = window.UnifiedOpportunityStore?.all?.()
            || window.ScannerState?.results
            || [];

        if (Array.isArray(current) && current.length) {
            return current.slice(0, 6);
        }

        return [
            { symbol: "BTC", score: 60, direction: "WATCH" },
            { symbol: "ETH", score: 60, direction: "WATCH" },
            { symbol: "SOL", score: 60, direction: "WATCH" },
            { symbol: "LINK", score: 54, direction: "WAIT" },
            { symbol: "AVAX", score: 52, direction: "WAIT" }
        ];
    }

    function render() {
        const panel = document.getElementById("opportunityHeatmap");
        if (!panel) return;

        if (panel.dataset.terminalEnhanced === "true" && panel.querySelector(".terminal-heatmap-card")) return;

        const items = rows();

        panel.innerHTML = `
            <section class="terminal-heatmap-card">
                <div class="heatmap-head">
                    <h2>Opportunity Heat Map</h2>
                    <span>${items.length} ranked</span>
                </div>
                <div class="heatmap-bars">
                    ${items.map((item, i) => {
                        const score = Number(item.score ?? item.opportunityScore ?? 60);
                        return `
                            <div class="heatmap-row">
                                <b>#${i + 1} ${item.symbol || "—"}</b>
                                <i><em style="width:${Math.max(0, Math.min(100, score))}%"></em></i>
                                <span>${score.toFixed(1)}</span>
                            </div>
                        `;
                    }).join("")}
                </div>
            </section>
        `;

        panel.dataset.terminalEnhanced = "true";
    }

    window.EventBus?.subscribe?.("scanner.results.updated", render);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(render, 75));
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1600));

    window.OpportunityHeatmapTerminalV55 = { render };
})();
