/*
Version 82.0 — AI Trade Guidance Panel
*/
(function () {
    const VERSION = "82.0";

    function render(rec) {
        const panel = document.getElementById("aiTradeGuidancePanelV82");
        if (!panel) return;

        rec = rec || window.AITradingAssistantV82?.recommendation?.() || {};

        const steps = [
            rec.action === "PAPER BUY READY" ? "Stage a paper order from the top live opportunity." : "Wait for stronger confirmation.",
            `Respect stop near ${Number(rec.stop || 0).toFixed(2)}.`,
            `Initial target zone: ${Number(rec.tp1 || 0).toFixed(2)} to ${Number(rec.tp2 || 0).toFixed(2)}.`,
            `Do not exceed current portfolio risk limits: ${Number(rec.portfolioRisk || 0).toFixed(2)}% used.`,
            "Review the position in V81 after entry."
        ];

        panel.innerHTML = `
            <section class="v82-card">
                <div class="v82-header">
                    <div>
                        <h2>AI Trade Guidance</h2>
                        <span>step-by-step paper execution guidance</span>
                    </div>
                    <strong>${rec.symbol || "—"}</strong>
                </div>

                <div class="v82-step-list">
                    ${steps.map((step, i) => `
                        <div>
                            <b>${i + 1}</b>
                            <span>${step}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("ai-trading-assistant.updated", render);
        setTimeout(() => render(), 2000);
    }

    window.AITradeGuidancePanelV82 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
