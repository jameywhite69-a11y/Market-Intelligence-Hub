/*
Version 74.0 — Real-Time Quote Tape
*/
(function () {
    const VERSION = "74.0";

    function render(snapshot) {
        const panel = document.getElementById("realtimeQuoteTapePanelV74");
        if (!panel) return;

        const quotes = Object.values(snapshot?.quotes || {});

        panel.innerHTML = `
            <section class="v74-card">
                <div class="v74-header">
                    <div>
                        <h2>Real-Time Quote Tape</h2>
                        <span>${quotes.length} synchronized symbols</span>
                    </div>
                    <strong>${snapshot?.enabled ? "LIVE" : "IDLE"}</strong>
                </div>

                <div class="v74-tape">
                    ${quotes.map(q => `
                        <div class="${q.changePct >= 0 ? "up" : "down"}">
                            <b>${q.symbol}</b>
                            <span>${Number(q.price || 0).toFixed(2)}</span>
                            <em>${q.changePct >= 0 ? "+" : ""}${Number(q.changePct || 0).toFixed(2)}%</em>
                        </div>
                    `).join("") || "<div class='v74-empty'>Start the data bus to populate quotes.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.RealtimeDataBusV74?.subscribe?.(render);
        window.EventBus?.subscribe?.("realtime-data.updated", render);
    }

    window.RealtimeQuoteTapeV74 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1600));
})();
