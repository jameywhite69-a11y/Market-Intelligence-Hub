/*
Version 83.0 — Paper Trading Session Panel
*/
(function () {
    const VERSION = "83.0";
    const KEY = "mih.tios.paper.session.v83";

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || { startedAt: null, notes: [] }; }
        catch { return { startedAt: null, notes: [] }; }
    }

    function save(s) {
        localStorage.setItem(KEY, JSON.stringify(s));
        render();
        return s;
    }

    function startSession() {
        return save({ startedAt: new Date().toISOString(), notes: [] });
    }

    function addNote(text) {
        const s = load();
        s.notes.unshift({ time: new Date().toLocaleTimeString(), text: text || "Session note" });
        s.notes = s.notes.slice(0, 20);
        return save(s);
    }

    function render() {
        const panel = document.getElementById("paperTradingSessionPanelV83");
        if (!panel) return;

        const s = load();
        const account = window.PaperTradingAccountV80?.snapshot?.() || {};
        const trades = account.trades || [];

        panel.innerHTML = `
            <section class="v83-card">
                <div class="v83-header">
                    <div>
                        <h2>Paper Trading Session</h2>
                        <span>${s.startedAt ? new Date(s.startedAt).toLocaleString() : "session not started"}</span>
                    </div>
                    <strong>${trades.length} TRADES</strong>
                </div>

                <div class="v83-actions">
                    <button id="v83StartSession">Start Session</button>
                    <button id="v83AddNote">Add Note</button>
                </div>

                <div class="v83-event-list">
                    ${s.notes.map(n => `<div><b>${n.time}</b><span>${n.text}</span></div>`).join("") || "<div class='v83-empty'>No session notes yet.</div>"}
                </div>
            </section>
        `;

        document.getElementById("v83StartSession")?.addEventListener("click", startSession);
        document.getElementById("v83AddNote")?.addEventListener("click", () => addNote("Reviewed paper trade setup."));
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        setTimeout(render, 2100);
    }

    window.PaperTradingSessionPanelV83 = { load, startSession, addNote, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
