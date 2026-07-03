/*
Version 84.0 — Paper Trade Journal
Paper trading only. No live broker execution.
*/
(function () {
    const VERSION = "84.0";
    const KEY = "mih.tios.paper.journal.v84";

    function notes() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }

    function saveNotes(list) {
        localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
        render();
    }

    function account() {
        return window.PaperTradingAccountV80?.snapshot?.() || { trades: [], positions: [], orders: [] };
    }

    function buildEntries() {
        const acct = account();

        const tradeEntries = (acct.trades || []).map((t, i) => ({
            type: "TRADE",
            title: `${t.symbol || "—"} closed`,
            time: t.closedAt || "—",
            result: Number(t.pnl || 0) >= 0 ? "WIN" : "LOSS",
            pnl: Number(t.pnl || 0),
            r: Number(t.r || 0),
            note: t.strategy || "Paper trade"
        }));

        const orderEntries = (acct.orders || []).slice(0, 20).map(o => ({
            type: "ORDER",
            title: `${o.status || "ORDER"} ${o.symbol || "—"}`,
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : "—",
            result: o.status || "—",
            pnl: 0,
            r: 0,
            note: `Entry ${Number(o.entry || 0).toFixed(2)} · Stop ${Number(o.stop || 0).toFixed(2)}`
        }));

        const manualEntries = notes().map(n => ({
            type: "NOTE",
            title: n.title || "Manual Review Note",
            time: n.time || "—",
            result: "NOTE",
            pnl: 0,
            r: 0,
            note: n.note || ""
        }));

        return [...manualEntries, ...tradeEntries, ...orderEntries].slice(0, 60);
    }

    function addNote(text) {
        const list = notes();
        list.unshift({
            time: new Date().toLocaleTimeString(),
            title: "Manual Review Note",
            note: text || "Reviewed paper trading session."
        });
        saveNotes(list);
    }

    function clearNotes() {
        localStorage.removeItem(KEY);
        render();
    }

    function render() {
        const panel = document.getElementById("paperTradeJournalPanelV84");
        if (!panel) return;

        const entries = buildEntries();

        panel.innerHTML = `
            <section class="v84-card">
                <div class="v84-header">
                    <div>
                        <h2>Paper Trade Journal</h2>
                        <span>${entries.length} journal entries</span>
                    </div>
                    <strong>REVIEW</strong>
                </div>

                <div class="v84-actions">
                    <button id="v84AddJournalNote">Add Review Note</button>
                    <button id="v84ClearJournalNotes">Clear Manual Notes</button>
                </div>

                <div class="v84-journal-list">
                    ${entries.map(e => `
                        <div class="${String(e.result).toLowerCase()}">
                            <b>${e.time}</b>
                            <span>${e.title}</span>
                            <em>${e.result}${e.type === "TRADE" ? ` · $${e.pnl.toFixed(2)} · ${e.r.toFixed(2)}R` : ""}</em>
                            <p>${e.note}</p>
                        </div>
                    `).join("") || "<div class='v84-empty'>No paper trading activity yet.</div>"}
                </div>
            </section>
        `;

        document.getElementById("v84AddJournalNote")?.addEventListener("click", () => addNote());
        document.getElementById("v84ClearJournalNotes")?.addEventListener("click", clearNotes);
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("paper-command-center-v83.updated", render);
        setTimeout(render, 1600);
    }

    window.PaperTradeJournalV84 = { buildEntries, addNote, clearNotes, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
