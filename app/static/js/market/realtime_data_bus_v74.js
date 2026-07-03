/*
Version 74.0 — Real-Time Data Synchronization Bus
Purpose:
- Create one shared market data stream for all panels.
- Polls existing quote/snapshot endpoints if available.
- Falls back to simulated-safe updates when live data is unavailable.
- No broker execution.
*/
(function () {
    const VERSION = "74.0";
    const STATE = {
        enabled: false,
        intervalMs: 5000,
        timer: null,
        quotes: {},
        lastError: null,
        subscribers: new Set()
    };

    function symbols() {
        const settings = window.UnifiedSettingsStoreV73?.load?.();
        const raw =
            settings?.watchlist?.defaultSymbols ||
            document.getElementById("symbolsInput")?.value ||
            "BTC,ETH,SOL,LINK,AVAX";

        return raw.split(/[,\n ]+/).map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 20);
    }

    function simulatedQuote(symbol) {
        const base = Math.abs(symbol.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0));
        const drift = Math.sin(Date.now() / 30000 + base) * 1.25;
        const price = (base * 7.31 + 100 + drift).toFixed(2);
        return {
            symbol,
            price: Number(price),
            changePct: Number((Math.sin(Date.now() / 45000 + base) * 2.5).toFixed(2)),
            source: "demo-safe",
            timestamp: new Date().toISOString()
        };
    }

    async function fetchQuote(symbol) {
        try {
            const response = await fetch(`/api/market-data/quote/${encodeURIComponent(symbol)}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return {
                symbol,
                price: Number(data.price ?? data.last ?? data.close ?? simulatedQuote(symbol).price),
                changePct: Number(data.changePct ?? data.change_percent ?? 0),
                source: data.source || "api",
                timestamp: new Date().toISOString()
            };
        } catch (err) {
            STATE.lastError = String(err.message || err);
            return simulatedQuote(symbol);
        }
    }

    async function tick(reason = "poll") {
        const list = symbols();
        const results = await Promise.all(list.map(fetchQuote));
        results.forEach(q => STATE.quotes[q.symbol] = q);

        const snapshot = getSnapshot();
        snapshot.reason = reason;

        STATE.subscribers.forEach(fn => {
            try { fn(snapshot); }
            catch (err) { console.warn("[RealtimeDataBusV74 subscriber]", err); }
        });

        window.EventBus?.publish?.("realtime-data.updated", snapshot);
        render();
        return snapshot;
    }

    function start() {
        if (STATE.timer) clearInterval(STATE.timer);
        STATE.enabled = true;
        tick("start");
        STATE.timer = setInterval(() => tick("interval"), STATE.intervalMs);
        render();
    }

    function stop() {
        STATE.enabled = false;
        if (STATE.timer) clearInterval(STATE.timer);
        STATE.timer = null;
        window.EventBus?.publish?.("realtime-data.stopped", getSnapshot());
        render();
    }

    function setIntervalMs(ms) {
        STATE.intervalMs = Math.max(2000, Number(ms || 5000));
        if (STATE.enabled) start();
    }

    function subscribe(fn) {
        STATE.subscribers.add(fn);
        setTimeout(() => fn(getSnapshot()), 0);
        return () => STATE.subscribers.delete(fn);
    }

    function getSnapshot() {
        return {
            version: VERSION,
            enabled: STATE.enabled,
            intervalMs: STATE.intervalMs,
            quotes: { ...STATE.quotes },
            symbols: symbols(),
            lastError: STATE.lastError,
            timestamp: new Date().toISOString()
        };
    }

    function render() {
        const panel = document.getElementById("realtimeDataBusPanelV74");
        if (!panel) return;

        const snap = getSnapshot();
        const quoteCount = Object.keys(snap.quotes).length;

        panel.innerHTML = `
            <section class="v74-card">
                <div class="v74-header">
                    <div>
                        <h2>Real-Time Data Bus</h2>
                        <span>shared quote stream · ${snap.intervalMs / 1000}s refresh</span>
                    </div>
                    <strong>${snap.enabled ? "RUNNING" : "STOPPED"}</strong>
                </div>

                <div class="v74-grid">
                    <div><small>Symbols</small><b>${snap.symbols.length}</b></div>
                    <div><small>Quotes</small><b>${quoteCount}</b></div>
                    <div><small>Source</small><b>${Object.values(snap.quotes)[0]?.source || "—"}</b></div>
                    <div><small>Error</small><b>${snap.lastError ? "fallback" : "none"}</b></div>
                </div>

                <div class="v74-actions">
                    <button id="v74StartDataBus">Start Data Bus</button>
                    <button id="v74StopDataBus">Stop</button>
                    <button id="v74TickDataBus">Refresh Now</button>
                </div>
            </section>
        `;

        document.getElementById("v74StartDataBus")?.addEventListener("click", start);
        document.getElementById("v74StopDataBus")?.addEventListener("click", stop);
        document.getElementById("v74TickDataBus")?.addEventListener("click", () => tick("manual"));
    }

    function wire() {
        window.EventBus?.subscribe?.("unified-settings.updated", () => tick("settings"));
        render();
    }

    window.RealtimeDataBusV74 = {
        start,
        stop,
        tick,
        setIntervalMs,
        subscribe,
        getSnapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
