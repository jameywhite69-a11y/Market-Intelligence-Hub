(function () {
    function renderEventDiagnostics() {
        const panel = document.getElementById("eventDiagnosticsPanel");
        if (!panel || !window.EventBus) return;

        const recent = EventBus.recent ? EventBus.recent(20) : [];
        panel.innerHTML = `
            <section class="core-diagnostics-card">
                <div class="core-diagnostics-header">
                    <h3>Event Diagnostics</h3>
                    <span>${recent.length} recent</span>
                </div>
                <div class="event-diagnostics-list">
                    ${recent.slice().reverse().map(event => `
                        <div class="event-diagnostics-row">
                            <b>${event.name}</b>
                            <span>${new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                    `).join("") || `<p class="muted">No events yet.</p>`}
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("*", () => renderEventDiagnostics());
    document.addEventListener("paper-trade-updated", renderEventDiagnostics);
    window.EventDiagnostics = { renderEventDiagnostics };
})();
