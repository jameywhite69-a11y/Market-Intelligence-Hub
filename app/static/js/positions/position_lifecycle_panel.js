async function fetchPositionLifecycle() {
    const response = await fetch("/api/positions/lifecycle", {
        headers: {"Accept": "application/json"},
    });
    if (!response.ok) throw new Error(`Lifecycle failed: ${response.status}`);
    return await response.json();
}

async function renderPositionLifecyclePanel() {
    const panel = document.getElementById("positionLifecyclePanel");
    if (!panel) return;

    try {
        const payload = await fetchPositionLifecycle();
        const events = payload.events || [];

        panel.innerHTML = `
            <section class="position-lifecycle-card">
                <div class="terminal-card-header">
                    <h3>Lifecycle Events</h3>
                    <span>${events.length} events</span>
                </div>
                <div class="lifecycle-event-list">
                    ${events.slice(-8).reverse().map(event => `
                        <div class="lifecycle-event-row">
                            <b>${event.symbol}</b>
                            <span>${event.previous_state || "—"} → ${event.new_state}</span>
                            <small>${event.reason}</small>
                        </div>
                    `).join("") || `<p class="muted">No lifecycle events yet.</p>`}
                </div>
            </section>
        `;
    } catch (error) {
        panel.innerHTML = `<p class="muted">Lifecycle unavailable: ${error.message}</p>`;
    }
}

document.addEventListener("paper-trade-updated", renderPositionLifecyclePanel);
window.EventBus?.subscribe?.("paper-order-filled", renderPositionLifecyclePanel);
window.EventBus?.subscribe?.("scan:completed", renderPositionLifecyclePanel);

window.PositionLifecyclePanel = {renderPositionLifecyclePanel};
