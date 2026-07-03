/*
Version 65.0 — Order Lifecycle Panel
Displays staged/submitted/filled/cancelled paper orders.
*/
(function () {
    const VERSION = "65.0";

    function render() {
        const panel = document.getElementById("orderLifecyclePanelV65");
        if (!panel) return;

        const state = window.ExecutionServiceV65?.snapshot?.() || { orders: [], fills: [], log: [] };

        panel.innerHTML = `
            <section class="v65-card">
                <div class="v65-header">
                    <div>
                        <h2>Order Lifecycle</h2>
                        <span>${state.orders.length} orders · ${state.fills.length} fills</span>
                    </div>
                    <strong>PAPER</strong>
                </div>

                <div class="v65-order-list">
                    ${state.orders.slice(0, 8).map(order => `
                        <div class="${order.status.toLowerCase()}">
                            <b>${order.symbol}</b>
                            <span>${order.side} ${order.qty}</span>
                            <em>${order.status}</em>
                        </div>
                    `).join("") || "<div class='v65-empty'>No paper orders yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("execution-service.order-staged", render);
        window.EventBus?.subscribe?.("execution-service.order-submitted", render);
        window.EventBus?.subscribe?.("execution-service.order-cancelled", render);
        window.EventBus?.subscribe?.("execution-service.fill", render);
        setTimeout(render, 1600);
    }

    window.OrderLifecyclePanelV65 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1100));
})();
