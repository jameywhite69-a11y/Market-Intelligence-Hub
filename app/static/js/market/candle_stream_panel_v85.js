/*
Version 85.0 — Candle Stream Panel
*/
(function () {
    const VERSION = "85.0";

    function render(snapshot) {
        const panel = document.getElementById("candleStreamPanelV85");
        if (!panel) return;

        snapshot = snapshot || window.StreamingMarketDataBusV85?.snapshot?.() || {};
        const rows = Object.entries(snapshot.candles || {}).map(([symbol, candles]) => {
            const last = candles[candles.length - 1] || {};
            return { symbol, count: candles.length, last };
        });

        panel.innerHTML = `
            <section class="v85-card">
                <div class="v85-header">
                    <div>
                        <h2>Candle Stream</h2>
                        <span>1-minute synthetic candles from shared tick stream</span>
                    </div>
                    <strong>${rows.length}</strong>
                </div>

                <div class="v85-table-list">
                    ${rows.map(r => `
                        <div>
                            <b>${r.symbol}</b>
                            <span>O ${Number(r.last.open || 0).toFixed(2)} / C ${Number(r.last.close || 0).toFixed(2)}</span>
                            <em>${r.count} bars</em>
                        </div>
                    `).join("") || "<div class='v85-empty'>Start the stream to build candles.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.StreamingMarketDataBusV85?.subscribe?.(render);
        window.EventBus?.subscribe?.("streaming-market-data.updated", render);
        setTimeout(() => render(), 1800);
    }

    window.CandleStreamPanelV85 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
