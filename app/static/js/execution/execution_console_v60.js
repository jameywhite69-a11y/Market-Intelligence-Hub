/*
Version 60.0 — Execution Console
Single pane for pending workflows, active paper trades, and event log.
*/
(function () {
    const VERSION = "60.0";

    function render(payload) {
        const panel = document.getElementById("executionConsoleV60Panel");
        if (!panel) return;

        const queue = payload?.queue || window.ExecutionWorkflowEngineV60?.queue?.() || [];
        const log = payload?.log || window.ExecutionWorkflowEngineV60?.log?.() || [];

        panel.innerHTML = `
            <section class="v60-console-card">
                <div class="v60-header">
                    <div>
                        <h2>Execution Console</h2>
                        <span>${queue.length} workflows · ${log.length} events</span>
                    </div>
                    <strong>PAPER</strong>
                </div>

                <div class="v60-console-grid">
                    <div>
                        <h3>Workflow Queue</h3>
                        <div class="v60-console-list">
                            ${queue.slice(0, 8).map(item => `
                                <button data-symbol="${item.symbol}">
                                    <b>${item.symbol}</b>
                                    <span>${item.stage}</span>
                                    <em>${item.score.toFixed(1)}</em>
                                </button>
                            `).join("") || "<p>No queued workflows.</p>"}
                        </div>
                    </div>

                    <div>
                        <h3>Event Log</h3>
                        <div class="v60-event-log">
                            ${log.slice(0, 12).map(item => `
                                <div>
                                    <b>${item.time}</b>
                                    <span>${item.message}</span>
                                </div>
                            `).join("") || "<p>No events yet.</p>"}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("execution-workflow.updated", render);
        setTimeout(() => render(), 1500);
    }

    window.ExecutionConsoleV60 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
