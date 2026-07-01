(function () {
    function renderDecisionPipelineMonitorPanel() {
        const panel = document.getElementById("decisionPipelineMonitorPanel");
        if (!panel) return;

        const pipeline = window.DecisionPipelineMonitor?.snapshot?.() || {};
        const stages = pipeline.stages || [];
        const completed = stages.filter(stage => stage.status === "ok").length;
        const total = stages.length || 1;
        const latency = window.DecisionPipelineMonitor?.currentLatency?.() || 0;

        panel.innerHTML = `
            <section class="decision-monitor-card">
                <div class="terminal-card-header">
                    <h3>Decision Pipeline Monitor</h3>
                    <span>${completed}/${total} · ${latency} ms</span>
                </div>

                <div class="decision-monitor-target">
                    <b>${pipeline.symbol || "No Selection"}</b>
                    <span>${pipeline.timeframe || "—"}</span>
                </div>

                <div class="decision-monitor-list">
                    ${stages.map(stage => `
                        <div class="decision-monitor-row ${stage.status}">
                            <strong>${stage.status === "ok" ? "✓" : stage.status === "fail" ? "!" : "•"}</strong>
                            <div>
                                <b>${stage.name}</b>
                                <span>${stage.detail || "Waiting"}</span>
                            </div>
                            <em>${stage.latencyMs === null ? "—" : `${stage.latencyMs} ms`}</em>
                        </div>
                    `).join("")}
                </div>

                <button id="resetDecisionPipelineButton" class="secondary-button">Reset Pipeline</button>
            </section>
        `;

        document.getElementById("resetDecisionPipelineButton")?.addEventListener("click", () => {
            window.DecisionPipelineMonitor?.reset?.();
            renderDecisionPipelineMonitorPanel();
        });
    }

    window.EventBus?.subscribe?.("decision-pipeline.updated", renderDecisionPipelineMonitorPanel);
    window.EventBus?.subscribe?.("unified-opportunity.changed", renderDecisionPipelineMonitorPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderDecisionPipelineMonitorPanel, 1200));

    window.DecisionPipelineMonitorPanel = {
        renderDecisionPipelineMonitorPanel
    };
})();
