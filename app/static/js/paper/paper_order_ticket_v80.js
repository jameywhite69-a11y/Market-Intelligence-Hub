/*
Version 80.0 — Paper Order Ticket
*/
(function () {
    const VERSION = "80.0";

    function selected() {
        return window.LiveOpportunityEngineV79?.latest?.()?.[0] || window.MarketContextStoreV63?.get?.()?.selected || {};
    }

    function render() {
        const panel = document.getElementById("paperOrderTicketPanelV80");
        if (!panel) return;

        const o = selected();
        const qty = window.PaperTradingAccountV80?.snapshot ? 
            Math.max(0, Math.floor((100000 * 0.005) / Math.max(0.01, Math.abs(Number(o.entry || o.price || 0) - Number(o.stop || 0))))) : 0;

        panel.innerHTML = `
            <section class="v80-card">
                <div class="v80-header">
                    <div>
                        <h2>Paper Order Ticket</h2>
                        <span>${o.symbol || "—"} · ${o.decision || "WAIT"}</span>
                    </div>
                    <strong>${Number(o.score || 0).toFixed(1)}</strong>
                </div>

                <div class="v80-grid">
                    <div><small>Entry</small><b>${Number(o.entry || o.price || 0).toFixed(2)}</b></div>
                    <div><small>Stop</small><b>${Number(o.stop || 0).toFixed(2)}</b></div>
                    <div><small>TP1</small><b>${Number(o.tp1 || 0).toFixed(2)}</b></div>
                    <div><small>TP2</small><b>${Number(o.tp2 || 0).toFixed(2)}</b></div>
                    <div><small>Qty</small><b>${qty}</b></div>
                    <div><small>Mode</small><b>PAPER</b></div>
                </div>

                <div class="v80-note">
                    <b>Paper Only</b>
                    <span>This ticket sends orders only to the local V80 paper account ledger.</span>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        setTimeout(render, 1700);
    }

    window.PaperOrderTicketV80 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
