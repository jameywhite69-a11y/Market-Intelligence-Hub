/*
Version 80.0 — Institutional Paper Trading Account
Purpose:
- Complete paper account ledger.
- Uses live opportunities from V79.
- No live broker execution.
*/
(function () {
    const VERSION = "80.0";
    const KEY = "mih.tios.paper.account.v80";

    const DEFAULT_STATE = {
        equity: 100000,
        cash: 100000,
        buyingPower: 100000,
        realizedPnl: 0,
        positions: [],
        orders: [],
        trades: [],
        events: []
    };

    function clone(x) {
        try { return JSON.parse(JSON.stringify(x)); }
        catch { return x; }
    }

    function load() {
        try { return { ...DEFAULT_STATE, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
        catch { return clone(DEFAULT_STATE); }
    }

    function save(state) {
        localStorage.setItem(KEY, JSON.stringify(state));
        publish(state);
        render();
        return state;
    }

    function log(state, message, data) {
        state.events.unshift({
            time: new Date().toLocaleTimeString(),
            message,
            data: data || {}
        });
        state.events = state.events.slice(0, 100);
    }

    function latestOpportunity() {
        return window.LiveOpportunityEngineV79?.latest?.()?.[0]
            || window.MarketContextStoreV63?.get?.()?.selected
            || {};
    }

    function calcQty(opportunity, riskPct) {
        const state = load();
        const entry = Number(opportunity.entry || opportunity.price || 0);
        const stop = Number(opportunity.stop || entry * 0.985);
        const riskDollars = state.equity * (Number(riskPct || 0.005));
        const perUnitRisk = Math.max(0.01, Math.abs(entry - stop));
        return Math.max(0, Math.floor(riskDollars / perUnitRisk));
    }

    function stageOrder(opportunity, riskPct = 0.005) {
        opportunity = opportunity || latestOpportunity();
        const state = load();

        const entry = Number(opportunity.entry || opportunity.price || 0);
        const qty = calcQty(opportunity, riskPct);
        const notional = qty * entry;

        const order = {
            id: `PAPER-${Date.now()}`,
            symbol: opportunity.symbol || "—",
            side: "BUY",
            qty,
            entry,
            stop: Number(opportunity.stop || entry * 0.985),
            tp1: Number(opportunity.tp1 || entry * 1.02),
            tp2: Number(opportunity.tp2 || entry * 1.035),
            notional,
            riskPct,
            status: "STAGED",
            source: "paper-v80",
            createdAt: new Date().toISOString()
        };

        state.orders.unshift(order);
        log(state, `Paper order staged: ${order.symbol}`, order);
        save(state);
        return order;
    }

    function submitOrder(orderId) {
        const state = load();
        const order = state.orders.find(o => o.id === orderId) || state.orders[0];
        if (!order || order.status === "FILLED") return null;

        if (order.notional > state.cash) {
            order.status = "REJECTED";
            log(state, `Paper order rejected: insufficient cash ${order.symbol}`, order);
            save(state);
            return order;
        }

        order.status = "FILLED";
        order.filledAt = new Date().toISOString();

        const position = {
            id: `POS-${Date.now()}`,
            orderId: order.id,
            symbol: order.symbol,
            side: order.side,
            qty: order.qty,
            entry: order.entry,
            mark: order.entry,
            stop: order.stop,
            tp1: order.tp1,
            tp2: order.tp2,
            notional: order.notional,
            unrealizedPnl: 0,
            realizedPnl: 0,
            status: "OPEN",
            openedAt: new Date().toISOString()
        };

        state.cash -= order.notional;
        state.positions.unshift(position);
        log(state, `Paper order filled: ${order.symbol}`, { order, position });
        save(state);

        window.EventBus?.publish?.("paper-trading.order-filled", { order, position, account: snapshot() });
        return { order, position };
    }

    function markPositions(quotes) {
        const state = load();
        quotes = quotes || window.RealtimeDataBusV74?.getSnapshot?.()?.quotes || {};

        state.positions.forEach(pos => {
            const q = quotes[pos.symbol];
            if (!q || pos.status !== "OPEN") return;

            pos.mark = Number(q.price || pos.mark);
            pos.unrealizedPnl = (pos.mark - pos.entry) * pos.qty;
        });

        state.equity = state.cash + state.positions
            .filter(p => p.status === "OPEN")
            .reduce((a, p) => a + (p.mark * p.qty), 0);

        state.buyingPower = state.cash;
        save(state);
        return state;
    }

    function closePosition(positionId) {
        const state = load();
        const pos = state.positions.find(p => p.id === positionId) || state.positions.find(p => p.status === "OPEN");
        if (!pos) return null;

        pos.status = "CLOSED";
        pos.closedAt = new Date().toISOString();
        pos.realizedPnl = (Number(pos.mark || pos.entry) - pos.entry) * pos.qty;

        state.cash += Number(pos.mark || pos.entry) * pos.qty;
        state.realizedPnl += pos.realizedPnl;
        state.trades.unshift({
            symbol: pos.symbol,
            pnl: pos.realizedPnl,
            r: pos.realizedPnl / Math.max(1, Math.abs((pos.entry - pos.stop) * pos.qty)),
            strategy: "V80 Paper Trade",
            closedAt: new Date().toLocaleTimeString()
        });

        log(state, `Paper position closed: ${pos.symbol}`, pos);
        save(state);

        if (window.PerformanceAnalyticsEngineV67?.addTrade) {
            window.PerformanceAnalyticsEngineV67.addTrade(state.trades[0]);
        }

        window.EventBus?.publish?.("paper-trading.position-closed", { position: pos, account: snapshot() });
        return pos;
    }

    function reset() {
        localStorage.removeItem(KEY);
        const state = load();
        log(state, "Paper account reset");
        save(state);
    }

    function snapshot() {
        return load();
    }

    function publish(state) {
        window.EventBus?.publish?.("paper-trading-account.updated", { version: VERSION, account: clone(state) });
    }

    function render() {
        const panel = document.getElementById("paperTradingAccountPanelV80");
        if (!panel) return;

        const s = load();
        const open = s.positions.filter(p => p.status === "OPEN");

        panel.innerHTML = `
            <section class="v80-card">
                <div class="v80-header">
                    <div>
                        <h2>Institutional Paper Trading Account</h2>
                        <span>live-opportunity paper execution</span>
                    </div>
                    <strong>$${Number(s.equity).toFixed(2)}</strong>
                </div>

                <div class="v80-grid">
                    <div><small>Cash</small><b>$${Number(s.cash).toFixed(2)}</b></div>
                    <div><small>Equity</small><b>$${Number(s.equity).toFixed(2)}</b></div>
                    <div><small>Open Pos.</small><b>${open.length}</b></div>
                    <div><small>Orders</small><b>${s.orders.length}</b></div>
                    <div><small>Realized</small><b>$${Number(s.realizedPnl).toFixed(2)}</b></div>
                    <div><small>Buying Power</small><b>$${Number(s.buyingPower).toFixed(2)}</b></div>
                </div>

                <div class="v80-actions">
                    <button id="v80StagePaper">Stage Top Opportunity</button>
                    <button id="v80SubmitPaper">Submit Latest Paper</button>
                    <button id="v80ClosePaper">Close First Open</button>
                    <button id="v80ResetPaper">Reset Paper Account</button>
                </div>
            </section>
        `;

        document.getElementById("v80StagePaper")?.addEventListener("click", () => stageOrder());
        document.getElementById("v80SubmitPaper")?.addEventListener("click", () => submitOrder());
        document.getElementById("v80ClosePaper")?.addEventListener("click", () => closePosition());
        document.getElementById("v80ResetPaper")?.addEventListener("click", reset);
    }

    function wire() {
        window.EventBus?.subscribe?.("realtime-data.updated", payload => markPositions(payload?.quotes || {}));
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        setTimeout(render, 1500);
    }

    window.PaperTradingAccountV80 = {
        stageOrder,
        submitOrder,
        closePosition,
        markPositions,
        snapshot,
        reset,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
