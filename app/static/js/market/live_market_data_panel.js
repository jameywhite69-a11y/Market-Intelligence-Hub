function getSymbolsForMarketData() {
    const input = document.getElementById("symbolsInput");
    const value = input?.value || "BTC,ETH,SOL";
    return value.split(",").map(symbol => symbol.trim().toUpperCase()).filter(Boolean);
}

function renderLiveMarketDataPanel(snapshot = window.WorkspaceStore?.get?.("marketDataSnapshot")) {
    const panel = document.getElementById("liveMarketDataPanel");
    if (!panel) return;

    const quotes = Object.values(snapshot?.quotes || {});

    panel.innerHTML = `
        <section class="live-market-card">
            <div class="terminal-card-header">
                <h3>Live Market Data</h3>
                <span>${snapshot?.provider || "demo"} · ${snapshot?.mode || "simulated"}</span>
            </div>

            <div class="live-market-controls">
                <button id="startMarketDataButton">Start Stream</button>
                <button id="stopMarketDataButton" class="secondary-button">Stop</button>
            </div>

            <div class="live-quote-list">
                ${quotes.length ? quotes.map(quote => `
                    <div class="live-quote-row">
                        <b>${quote.symbol}</b>
                        <span>$${Number(quote.price).toFixed(4)}</span>
                        <small>Bid ${Number(quote.bid).toFixed(4)} / Ask ${Number(quote.ask).toFixed(4)}</small>
                        <em>${Number(quote.change_percent).toFixed(2)}%</em>
                    </div>
                `).join("") : `<p class="muted">Stream not started.</p>`}
            </div>

            <small class="muted">Last update: ${snapshot?.last_update ? new Date(snapshot.last_update).toLocaleTimeString() : "—"}</small>
        </section>
    `;

    document.getElementById("startMarketDataButton")?.addEventListener("click", () => {
        window.liveMarketDataClient?.connect?.(getSymbolsForMarketData(), 2);
    });

    document.getElementById("stopMarketDataButton")?.addEventListener("click", () => {
        window.liveMarketDataClient?.disconnect?.();
    });
}

async function bootstrapLiveMarketDataPanel() {
    const panel = document.getElementById("liveMarketDataPanel");
    if (!panel) return;

    try {
        const snapshot = await window.liveMarketDataClient.snapshot(getSymbolsForMarketData());
        window.WorkspaceStore?.set?.("marketDataSnapshot", snapshot);
        renderLiveMarketDataPanel(snapshot);
    } catch (error) {
        panel.innerHTML = `<p class="muted">Live market data unavailable: ${error.message}</p>`;
    }
}

window.EventBus?.subscribe?.("market-data:tick", renderLiveMarketDataPanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(bootstrapLiveMarketDataPanel, 200));

window.LiveMarketDataPanel = {
    renderLiveMarketDataPanel,
    bootstrapLiveMarketDataPanel,
};
