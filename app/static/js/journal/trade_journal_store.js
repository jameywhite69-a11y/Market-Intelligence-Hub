/*
Version 43.1 — Trade Journal Store
Local persistent journal for paper trades, lifecycle events, and trader notes.
*/
(function () {
    const KEY = "mih.trade.journal.v43";
    const MAX = 1000;
    let entries = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
        catch { return []; }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX)));
    }

    function addEntry(entry) {
        const row = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            symbol: entry.symbol || entry.order?.symbol || entry.opportunity?.symbol || "UNKNOWN",
            timeframe: entry.timeframe || entry.order?.timeframe || entry.opportunity?.timeframe || "15m",
            side: entry.side || entry.order?.side || "buy",
            quantity: Number(entry.quantity || entry.order?.quantity || 0),
            entryPrice: Number(entry.entryPrice || entry.order?.entry_price || entry.order?.fill_price || 0),
            exitPrice: Number(entry.exitPrice || 0),
            status: entry.status || "Open",
            source: entry.source || "manual",
            notes: entry.notes || "",
            score: Number(entry.score || entry.opportunity?.score || 0),
            expectedR: Number(entry.expectedR || entry.opportunity?.expectedR || entry.opportunity?.expected_r || 0),
            createdAt: entry.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        entries.push(row);
        entries = entries.slice(-MAX);
        save();

        window.WorkspaceStore?.set?.("tradeJournalEntries", entries.slice());
        window.EventBus?.publish?.("trade-journal.updated", { entry: row, entries: entries.slice() });
        return row;
    }

    function updateEntry(id, patch) {
        entries = entries.map(row => row.id === id ? { ...row, ...patch, updatedAt: new Date().toISOString() } : row);
        save();
        window.EventBus?.publish?.("trade-journal.updated", { entries: entries.slice() });
    }

    function list(limit = 100) {
        return entries.slice(-limit).reverse();
    }

    function clear() {
        entries = [];
        save();
        window.EventBus?.publish?.("trade-journal.cleared", {});
    }

    function capturePaperOrder(payload) {
        const order = payload?.order || payload;
        if (!order?.symbol) return null;
        return addEntry({
            order,
            status: "Open",
            source: "paper-order",
        });
    }

    window.EventBus?.subscribe?.("paper-order-filled", capturePaperOrder);

    window.TradeJournalStore = {
        addEntry,
        updateEntry,
        list,
        clear,
        load,
        capturePaperOrder,
    };
})();
