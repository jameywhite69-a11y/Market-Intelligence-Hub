/*
Version 66.0 — Order Monitor
Shows order events and active order states.
*/
(function () {
    const VERSION = "66.0";

    function render(snapshot) {
        const panel = document.getElementById("orderMonitorPanelV66");
        if (!panel) return;

        const s = snapshot || window.LiveOrderManagerV66?.snapshot?.() || { orders: [], events: [] };

        panel.innerHTML = `
            <section class="v66-card">
                <div class="v66-header">
                    <div>
                        <h2>Order Monitor</h2>
                        <span>${s.orders.length} orders · ${s.events.length} events</span>
                    </div>
                    <strong>LIVE-READY</strong>
                </div>

                <div class="v66-order-list">
                    ${s.orders.slice(0, 8).map(o => `
                        <div class="${String(o.status).toLowerCase()}">
                            <b>${o.symbol}</b>
                            <span>${o.side} ${o.qty}</span>
                            <em>${o.status}</em>
                        </div>
                    `).join("") || "<div class='v66-empty'>No orders yet.</div>"}
                </div>

                <div class="v66-event-list">
                    ${s.events.slice(0, 8).map(e => `
                        <div>
                            <b>${e.time}</b>
                            <span>${e.message}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("live-order-manager.updated", render);
        setTimeout(() => render(), 1700);
    }

    window.OrderMonitorV66 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
