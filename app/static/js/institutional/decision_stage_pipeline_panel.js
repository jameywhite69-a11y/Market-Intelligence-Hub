(function () {
    function renderDecisionStagePipelinePanel() {
        const panel = document.getElementById("decisionStagePipelinePanel");
        if (!panel) return;

        const pipeline = window.DecisionStagePipeline?.current?.();

        if (!pipeline) {
            panel.innerHTML = `<section class="idp-card"><div class="terminal-card-header"><h3>Decision Stage Pipeline</h3><span>Waiting</span></div></section>`;
            return;
        }

        panel.innerHTML = `
            <section class="idp-card">
                <div class="terminal-card-header">
                    <h3>Decision Stage Pipeline</h3>
                    <span>${pipeline.symbol || "—"}</span>
                </div>

                <div class="stage-pipeline-list">
                    ${(pipeline.stages || []).map(stage => `
                        <div class="stage-row ${stage.status}">
                            <strong>${stage.status === "pass" ? "✓" : stage.status === "fail" ? "!" : stage.status === "warn" ? "?" : "•"}</strong>
                            <div>
                                <b>${stage.name}</b>
                                <span>${stage.detail}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </section>`;
    }

    window.EventBus?.subscribe?.("decision-stage-pipeline.updated", renderDecisionStagePipelinePanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderDecisionStagePipelinePanel, 1900));

    window.DecisionStagePipelinePanel = {
        renderDecisionStagePipelinePanel,
    };
})();
