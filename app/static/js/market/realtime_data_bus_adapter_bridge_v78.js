/*
Version 78.0 — Realtime Data Bus Adapter Bridge
Overrides/extends V74 data bus with adapter registry quotes.
No broker execution.
*/
(function () {
    const VERSION = "78.0";

    async function adapterTick(reason = "adapter-tick") {
        const bus = window.RealtimeDataBusV74;
        const registry = window.MarketDataAdapterRegistryV78;
        if (!bus || !registry) return null;

        const snap = bus.getSnapshot?.() || {};
        const symbols = snap.symbols || ["BTC", "ETH", "SOL", "LINK", "AVAX"];
        const adapter = registry.active?.();

        const result = await registry.getSnapshot(symbols);
        const next = {
            version: VERSION,
            enabled: snap.enabled,
            intervalMs: snap.intervalMs || 5000,
            adapter: adapter?.id || "unknown",
            quotes: result.quotes || {},
            symbols,
            lastError: null,
            timestamp: new Date().toISOString(),
            reason
        };

        window.EventBus?.publish?.("realtime-data.updated", next);
        window.EventBus?.publish?.("live-market-data.updated", next);
        render(next);
        return next;
    }

    function render(snapshot) {
        const panel = document.getElementById("realtimeAdapterBridgePanelV78");
        if (!panel) return;

        const quoteCount = Object.keys(snapshot?.quotes || {}).length;
        const adapter = snapshot?.adapter || window.MarketDataAdapterRegistryV78?.snapshot?.()?.activeAdapter || "—";

        panel.innerHTML = `
            <section class="v78-card">
                <div class="v78-header">
                    <div>
                        <h2>Realtime Adapter Bridge</h2>
                        <span>feeds V74 bus from selected provider</span>
                    </div>
                    <strong>${adapter.toUpperCase()}</strong>
                </div>

                <div class="v78-grid">
                    <div><small>Adapter</small><b>${adapter}</b></div>
                    <div><small>Quotes</small><b>${quoteCount}</b></div>
                    <div><small>Reason</small><b>${snapshot?.reason || "idle"}</b></div>
                    <div><small>Status</small><b>${quoteCount ? "synced" : "waiting"}</b></div>
                </div>

                <div class="v78-actions">
                    <button id="v78AdapterTick">Adapter Refresh</button>
                </div>
            </section>
        `;

        document.getElementById("v78AdapterTick")?.addEventListener("click", () => adapterTick("manual"));
    }

    function wire() {
        window.EventBus?.subscribe?.("market-data-adapter-registry.updated", () => adapterTick("adapter-registry"));
        window.EventBus?.subscribe?.("realtime-data.updated", render);
        setTimeout(() => {
            adapterTick("bootstrap");
            render();
        }, 1800);
    }

    window.RealtimeDataBusAdapterBridgeV78 = {
        adapterTick,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
