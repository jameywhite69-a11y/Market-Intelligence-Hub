/*
Version 85.0 — Streaming Market Data Bus
Purpose:
- Adds candle building, tick stream state, and shared streaming snapshots.
- Uses V78 adapters when available; falls back to demo-safe data.
- Feeds V79 live opportunity engine and future chart workspace.
- No live broker execution.
*/
(function () {
    const VERSION = "85.0";

    const STATE = {
        enabled: false,
        intervalMs: 3000,
        timer: null,
        ticks: {},
        candles: {},
        events: [],
        subscribers: new Set()
    };

    function symbols() {
        const settings = window.UnifiedSettingsStoreV73?.load?.();
        const raw = settings?.watchlist?.defaultSymbols || "BTC,ETH,SOL,LINK,AVAX";
        return raw.split(/[,\n ]+/).map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 30);
    }

    function log(message, data) {
        STATE.events.unshift({ time: new Date().toLocaleTimeString(), message, data: data || {} });
        STATE.events = STATE.events.slice(0, 100);
    }

    function candleBucket(ts) {
        const d = new Date(ts || Date.now());
        d.setSeconds(0, 0);
        return d.toISOString();
    }

    function updateCandle(symbol, tick) {
        const bucket = candleBucket(tick.timestamp);
        STATE.candles[symbol] = STATE.candles[symbol] || [];
        let candle = STATE.candles[symbol].find(c => c.bucket === bucket);

        if (!candle) {
            candle = {
                bucket,
                symbol,
                open: tick.price,
                high: tick.price,
                low: tick.price,
                close: tick.price,
                volume: Number(tick.volume || 0),
                ticks: 1
            };
            STATE.candles[symbol].push(candle);
            STATE.candles[symbol] = STATE.candles[symbol].slice(-120);
        } else {
            candle.high = Math.max(candle.high, tick.price);
            candle.low = Math.min(candle.low, tick.price);
            candle.close = tick.price;
            candle.volume += Number(tick.volume || 0);
            candle.ticks += 1;
        }

        return candle;
    }

    async function getProviderSnapshot(list) {
        if (window.MarketDataAdapterRegistryV78?.getSnapshot) {
            try {
                return await window.MarketDataAdapterRegistryV78.getSnapshot(list);
            } catch (err) {
                log("Adapter snapshot failed; using fallback", { error: String(err.message || err) });
            }
        }

        if (window.RealtimeDataBusV74?.getSnapshot) {
            const snap = window.RealtimeDataBusV74.getSnapshot();
            if (snap?.quotes && Object.keys(snap.quotes).length) {
                return { adapter: "v74", quotes: snap.quotes, timestamp: new Date().toISOString() };
            }
        }

        const quotes = {};
        list.forEach(symbol => {
            const base = Math.abs(symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
            const wave = Math.sin(Date.now() / 25000 + base) * 1.7;
            quotes[symbol] = {
                symbol,
                price: Number((base * 7.31 + 100 + wave).toFixed(2)),
                changePct: Number((Math.sin(Date.now() / 45000 + base) * 2.5).toFixed(2)),
                volume: Math.round(100000 + base * 151 + Math.abs(wave) * 12000),
                source: "stream-demo",
                timestamp: new Date().toISOString()
            };
        });
        return { adapter: "stream-demo", quotes, timestamp: new Date().toISOString() };
    }

    async function tick(reason = "stream") {
        const list = symbols();
        const provider = await getProviderSnapshot(list);
        const quotes = provider.quotes || {};

        Object.values(quotes).forEach(q => {
            const tick = {
                symbol: q.symbol,
                price: Number(q.price || 0),
                changePct: Number(q.changePct || 0),
                volume: Number(q.volume || 0),
                source: q.source || provider.adapter || "unknown",
                timestamp: q.timestamp || new Date().toISOString()
            };
            STATE.ticks[tick.symbol] = tick;
            updateCandle(tick.symbol, tick);
        });

        const snap = snapshot(reason);
        publish(snap);
        render(snap);
        return snap;
    }

    function publish(snap) {
        STATE.subscribers.forEach(fn => {
            try { fn(snap); } catch (err) { console.warn("[StreamingMarketDataBusV85]", err); }
        });

        window.EventBus?.publish?.("streaming-market-data.updated", snap);
        window.EventBus?.publish?.("realtime-data.updated", {
            version: VERSION,
            enabled: STATE.enabled,
            intervalMs: STATE.intervalMs,
            quotes: snap.quotes,
            symbols: snap.symbols,
            adapter: snap.adapter,
            timestamp: snap.timestamp,
            reason: "v85-stream"
        });
    }

    function start() {
        stop();
        STATE.enabled = true;
        tick("start");
        STATE.timer = setInterval(() => tick("interval"), STATE.intervalMs);
        render();
    }

    function stop() {
        if (STATE.timer) clearInterval(STATE.timer);
        STATE.timer = null;
        STATE.enabled = false;
        render();
    }

    function subscribe(fn) {
        STATE.subscribers.add(fn);
        setTimeout(() => fn(snapshot("subscribe")), 0);
        return () => STATE.subscribers.delete(fn);
    }

    function snapshot(reason = "snapshot") {
        return {
            version: VERSION,
            enabled: STATE.enabled,
            intervalMs: STATE.intervalMs,
            symbols: symbols(),
            quotes: { ...STATE.ticks },
            candles: JSON.parse(JSON.stringify(STATE.candles)),
            adapter: window.MarketDataAdapterRegistryV78?.snapshot?.()?.activeAdapter || "demo",
            events: STATE.events.slice(),
            reason,
            timestamp: new Date().toISOString()
        };
    }

    function render(snap) {
        const panel = document.getElementById("streamingMarketDataBusPanelV85");
        if (!panel) return;

        snap = snap || snapshot();
        const quoteCount = Object.keys(snap.quotes || {}).length;
        const candleCount = Object.values(snap.candles || {}).reduce((a, rows) => a + rows.length, 0);

        panel.innerHTML = `
            <section class="v85-card">
                <div class="v85-header">
                    <div>
                        <h2>Streaming Market Data Bus</h2>
                        <span>ticks · candles · shared realtime state</span>
                    </div>
                    <strong>${snap.enabled ? "STREAMING" : "STOPPED"}</strong>
                </div>

                <div class="v85-grid">
                    <div><small>Symbols</small><b>${snap.symbols.length}</b></div>
                    <div><small>Quotes</small><b>${quoteCount}</b></div>
                    <div><small>Candles</small><b>${candleCount}</b></div>
                    <div><small>Adapter</small><b>${snap.adapter}</b></div>
                    <div><small>Interval</small><b>${(snap.intervalMs / 1000).toFixed(0)}s</b></div>
                    <div><small>Status</small><b>${snap.enabled ? "active" : "idle"}</b></div>
                </div>

                <div class="v85-actions">
                    <button id="v85StartStream">Start Stream</button>
                    <button id="v85StopStream">Stop</button>
                    <button id="v85TickStream">Refresh Now</button>
                </div>
            </section>
        `;

        document.getElementById("v85StartStream")?.addEventListener("click", start);
        document.getElementById("v85StopStream")?.addEventListener("click", stop);
        document.getElementById("v85TickStream")?.addEventListener("click", () => tick("manual"));
    }

    function wire() {
        window.EventBus?.subscribe?.("market-data-adapter-registry.updated", () => tick("adapter-change"));
        render();
    }

    window.StreamingMarketDataBusV85 = {
        start,
        stop,
        tick,
        subscribe,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
