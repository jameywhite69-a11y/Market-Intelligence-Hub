(function () {
    function renderTradeJournalPanel() {
        const panel = document.getElementById("tradeJournalPanel");
        if (!panel) return;

        const entries = window.TradeJournalStore?.list?.(40) || [];
        const stats = window.PerformanceAnalytics?.calculate?.(entries) || {};

        panel.innerHTML = `
            <section class="trade-journal-card">
                <div class="terminal-card-header">
                    <h3>Trade Journal</h3>
                    <span>${entries.length} entries</span>
                </div>

                <div class="journal-stats-grid">
                    <div><b>Total</b><span>${stats.totalTrades || 0}</span></div>
                    <div><b>Open</b><span>${stats.openTrades || 0}</span></div>
                    <div><b>Win Rate</b><span>${Number(stats.winRate || 0).toFixed(1)}%</span></div>
                    <div><b>Profit Factor</b><span>${Number(stats.profitFactor || 0).toFixed(2)}</span></div>
                    <div><b>Expectancy</b><span>${Number(stats.expectancy || 0).toFixed(2)}R</span></div>
                    <div><b>Closed</b><span>${stats.closedTrades || 0}</span></div>
                </div>

                <div class="journal-manual-form">
                    <input id="journalNoteInput" placeholder="Add note for selected opportunity">
                    <button id="addJournalNoteButton">Add Note</button>
                </div>

                <div class="journal-entry-list">
                    ${entries.map(row => `
                        <div class="journal-entry-row">
                            <div>
                                <b>${row.symbol}</b>
                                <span>${row.timeframe} · ${row.side.toUpperCase()} · ${row.status}</span>
                                <small>${row.notes || row.source || "Recorded trade"}</small>
                            </div>
                            <strong>${Number(row.quantity || 0).toFixed(4)}</strong>
                        </div>
                    `).join("") || `<p class="muted">No journal entries yet. Paper fills will be captured automatically.</p>`}
                </div>
            </section>
        `;

        document.getElementById("addJournalNoteButton")?.addEventListener("click", () => {
            const note = document.getElementById("journalNoteInput")?.value || "";
            const context = window.WorkspaceContext?.snapshot?.() || {};
            const opportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.();

            window.TradeJournalStore?.addEntry?.({
                symbol: opportunity?.symbol || context.symbol || "NOTE",
                timeframe: opportunity?.timeframe || context.timeframe || "15m",
                status: "Note",
                source: "manual-note",
                notes: note,
                opportunity,
            });

            renderTradeJournalPanel();
        });
    }

    window.EventBus?.subscribe?.("trade-journal.updated", renderTradeJournalPanel);
    window.EventBus?.subscribe?.("trade-journal.cleared", renderTradeJournalPanel);
    window.EventBus?.subscribe?.("paper-order-filled", () => setTimeout(renderTradeJournalPanel, 0));
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderTradeJournalPanel, 600));

    window.TradeJournalPanel = { renderTradeJournalPanel };
})();
