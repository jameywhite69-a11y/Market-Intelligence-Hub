/*
Version 75.0 — Canonical State Viewer
Shows current dispatcher state and recent events.
*/
(function () {
    const VERSION = "75.0";

    function render(snapshot) {
        const panel = document.getElementById("canonicalStateViewerPanelV75");
        if (!panel) return;

        const snap = snapshot || window.CoreEventDispatcherV75?.snapshot?.() || { state: {}, eventLog: [] };

        panel.innerHTML = `
            <section class="v75-card">
                <div class="v75-header">
                    <div>
                        <h2>Canonical State Viewer</h2>
                        <span>single state consumed by future modules</span>
                    </div>
                    <strong>${snap.revision || 0}</strong>
                </div>

                <div class="v75-event-list">
                    ${(snap.eventLog || []).slice(0, 8).map(e => `
                        <div>
                            <b>${e.time}</b>
                            <span>${e.type}</span>
                        </div>
                    `).join("") || "<div class='v75-empty'>No dispatcher events yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.CoreEventDispatcherV75?.subscribe?.(render);
        window.EventBus?.subscribe?.("core-dispatcher.updated", render);
        setTimeout(() => render(), 1600);
    }

    window.CanonicalStateViewerV75 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1100));
})();
