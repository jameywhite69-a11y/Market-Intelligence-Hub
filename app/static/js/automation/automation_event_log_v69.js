/*
Version 69.0 — Automation Event Log
*/
(function () {
    const VERSION = "69.0";

    function render(snapshot) {
        const panel = document.getElementById("automationEventLogPanelV69");
        if (!panel) return;

        const s = snapshot || window.WorkflowAutomationEngineV69?.snapshot?.() || { events: [] };

        panel.innerHTML = `
            <section class="v69-card">
                <div class="v69-header">
                    <div>
                        <h2>Automation Event Log</h2>
                        <span>${s.events.length} recent events</span>
                    </div>
                    <strong>LOG</strong>
                </div>

                <div class="v69-event-list">
                    ${s.events.slice(0, 10).map(e => `
                        <div>
                            <b>${e.time}</b>
                            <span>${e.message}</span>
                        </div>
                    `).join("") || "<div class='v69-empty'>No automation events yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("workflow-automation.updated", render);
        setTimeout(() => render(), 2000);
    }

    window.AutomationEventLogV69 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
