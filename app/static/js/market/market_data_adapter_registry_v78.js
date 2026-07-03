/*
Version 78.0 — Live Data Adapter Registry
Provider-neutral market-data adapter registry.
Default remains demo-safe until a provider is configured.
No broker execution.
*/
(function () {
    const VERSION = "78.0";

    const STATE = {
        activeAdapter: "demo",
        adapters: new Map(),
        events: []
    };

    function log(message, data) {
        STATE.events.unshift({
            time: new Date().toLocaleTimeString(),
            message,
            data: data || {}
        });
        STATE.events = STATE.events.slice(0, 100);
    }

    function register(adapter) {
        if (!adapter || !adapter.id) return null;

        const record = {
            id: adapter.id,
            name: adapter.name || adapter.id,
            status: adapter.status || "available",
            live: adapter.live === true,
            requiresKey: adapter.requiresKey === true,
            supports: adapter.supports || ["quote"],
            getQuote: adapter.getQuote,
            getSnapshot: adapter.getSnapshot,
            health: adapter.health || (() => ({ ok: true, message: "available" }))
        };

        STATE.adapters.set(record.id, record);
        log(`Registered market-data adapter: ${record.id}`, record);
        publish();
        return record;
    }

    function list() {
        return Array.from(STATE.adapters.values()).map(a => ({
            id: a.id,
            name: a.name,
            status: a.status,
            live: a.live,
            requiresKey: a.requiresKey,
            supports: a.supports
        }));
    }

    function setActive(id) {
        if (!STATE.adapters.has(id)) return false;
        STATE.activeAdapter = id;
        log(`Active market-data adapter set: ${id}`);
        publish();
        return true;
    }

    function active() {
        return STATE.adapters.get(STATE.activeAdapter) || STATE.adapters.get("demo");
    }

    async function getQuote(symbol) {
        const adapter = active();
        if (!adapter?.getQuote) {
            throw new Error("No active market-data adapter getQuote()");
        }
        return adapter.getQuote(symbol);
    }

    async function getSnapshot(symbols) {
        const adapter = active();
        if (adapter?.getSnapshot) return adapter.getSnapshot(symbols);
        const quotes = {};
        for (const symbol of symbols) {
            quotes[symbol] = await getQuote(symbol);
        }
        return { adapter: adapter.id, quotes, timestamp: new Date().toISOString() };
    }

    function snapshot() {
        return {
            version: VERSION,
            activeAdapter: STATE.activeAdapter,
            adapters: list(),
            events: STATE.events.slice()
        };
    }

    function publish() {
        window.EventBus?.publish?.("market-data-adapter-registry.updated", snapshot());
    }

    function render() {
        const panel = document.getElementById("marketDataAdapterRegistryPanelV78");
        if (!panel) return;

        const s = snapshot();

        panel.innerHTML = `
            <section class="v78-card">
                <div class="v78-header">
                    <div>
                        <h2>Market Data Adapter Registry</h2>
                        <span>provider-neutral live-data layer</span>
                    </div>
                    <strong>${s.activeAdapter.toUpperCase()}</strong>
                </div>

                <div class="v78-adapter-list">
                    ${s.adapters.map(a => `
                        <button class="${a.id === s.activeAdapter ? "active" : ""}" data-adapter="${a.id}">
                            <b>${a.name}</b>
                            <span>${a.live ? "live capable" : "demo-safe"}</span>
                            <em>${a.status}</em>
                        </button>
                    `).join("")}
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-adapter]").forEach(btn => {
            btn.addEventListener("click", () => {
                setActive(btn.dataset.adapter);
                render();
                window.RealtimeDataBusV74?.tick?.("adapter-change");
            });
        });
    }

    function initDemoAdapter() {
        register({
            id: "demo",
            name: "Demo Safe Data",
            status: "enabled",
            live: false,
            requiresKey: false,
            supports: ["quote", "snapshot"],
            getQuote(symbol) {
                const base = Math.abs(String(symbol).split("").reduce((a, ch) => a + ch.charCodeAt(0), 0));
                const wave = Math.sin(Date.now() / 30000 + base) * 1.35;
                const price = Number((base * 7.31 + 100 + wave).toFixed(2));
                return Promise.resolve({
                    symbol,
                    price,
                    changePct: Number((Math.sin(Date.now() / 45000 + base) * 2.5).toFixed(2)),
                    volume: Math.round(100000 + base * 137 + Math.abs(wave) * 10000),
                    source: "demo-adapter",
                    timestamp: new Date().toISOString()
                });
            },
            async getSnapshot(symbols) {
                const quotes = {};
                for (const symbol of symbols) quotes[symbol] = await this.getQuote(symbol);
                return { adapter: "demo", quotes, timestamp: new Date().toISOString() };
            }
        });

        register({
            id: "internal-api",
            name: "Internal API",
            status: "available",
            live: true,
            requiresKey: false,
            supports: ["quote"],
            async getQuote(symbol) {
                const res = await fetch(`/api/market-data/quote/${encodeURIComponent(symbol)}`, { cache: "no-store" });
                if (!res.ok) throw new Error(`Internal API ${res.status}`);
                const data = await res.json();
                return {
                    symbol,
                    price: Number(data.price ?? data.last ?? data.close ?? 0),
                    changePct: Number(data.changePct ?? data.change_percent ?? 0),
                    volume: Number(data.volume ?? 0),
                    source: data.source || "internal-api",
                    timestamp: new Date().toISOString()
                };
            }
        });

        register({
            id: "coinbase-advanced",
            name: "Coinbase Advanced",
            status: "not_configured",
            live: true,
            requiresKey: true,
            supports: ["quote", "crypto"]
        });

        register({
            id: "alpaca",
            name: "Alpaca Market Data",
            status: "not_configured",
            live: true,
            requiresKey: true,
            supports: ["quote", "equities", "crypto"]
        });

        register({
            id: "tradestation",
            name: "TradeStation Market Data",
            status: "not_configured",
            live: true,
            requiresKey: true,
            supports: ["quote", "equities", "futures"]
        });
    }

    function init() {
        initDemoAdapter();
        render();
        document.body.dataset.marketDataAdapterRegistry = VERSION;
        window.EventBus?.subscribe?.("market-data-adapter-registry.updated", render);
    }

    window.MarketDataAdapterRegistryV78 = {
        register,
        list,
        setActive,
        active,
        getQuote,
        getSnapshot,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 900));
})();
