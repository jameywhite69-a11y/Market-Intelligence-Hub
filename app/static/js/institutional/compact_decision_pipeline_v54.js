/*
Version 54.0 — Compact Decision Pipeline
Compact professional status strip for the decision stage pipeline.
*/
(function () {
    function renderCompactDecisionPipeline() {
        const panel = document.getElementById("compactDecisionPipelinePanel");
        if (!panel) return;

        const stages = [
            ["Scanner", "pass"],
            ["Validation", "pass"],
            ["Risk", "review"],
            ["Consensus", "2/6"],
            ["Institutional", "71.8"],
            ["Execution", "WAIT"]
        ];

        panel.innerHTML = `
            <section class="compact-pipeline-card">
                <div class="compact-pipeline-header">
                    <h2>Decision Stage Pipeline</h2>
                    <span>Live</span>
                </div>
                <div class="compact-pipeline-steps">
                    ${stages.map(([name, status]) => `
                        <div class="compact-pipeline-step">
                            <b>${name}</b>
                            <span>${status}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", renderCompactDecisionPipeline);
    window.EventBus?.subscribe?.("unified-opportunity.changed", renderCompactDecisionPipeline);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderCompactDecisionPipeline, 1400));

    window.CompactDecisionPipelineV54 = { renderCompactDecisionPipeline };
})();
