(function () {
    const KEY = "tios.decision.stage.pipeline.v48";
    const STAGES = [
        "Scanner",
        "Validation",
        "Risk Review",
        "Strategy Consensus",
        "Institutional Score",
        "Execution Ready",
        "Order Prepared",
        "Position Managed",
        "Completed"
    ];

    function buildStages(pkg) {
        if (!pkg) return STAGES.map(name => ({ name, status: "waiting", detail: "Waiting" }));

        return [
            { name: "Scanner", status: "pass", detail: `${pkg.symbol} selected` },
            { name: "Validation", status: pkg.institutionalScore >= 70 ? "pass" : "fail", detail: `Score ${pkg.institutionalScore}` },
            { name: "Risk Review", status: ["Low", "Moderate"].includes(pkg.riskLevel) ? "pass" : "warn", detail: pkg.riskLevel },
            { name: "Strategy Consensus", status: pkg.strategyConsensus.alignment >= 65 ? "pass" : "warn", detail: `${pkg.strategyConsensus.alignment}% alignment` },
            { name: "Institutional Score", status: pkg.institutionalScore >= 80 ? "pass" : "warn", detail: `${pkg.institutionalScore} ${pkg.grade}` },
            { name: "Execution Ready", status: pkg.recommendation === "EXECUTE" ? "pass" : "warn", detail: pkg.entryStatus },
            { name: "Order Prepared", status: pkg.recommendation === "EXECUTE" ? "pass" : "waiting", detail: pkg.allocation > 0 ? `$${pkg.allocation}` : "No allocation" },
            { name: "Position Managed", status: "waiting", detail: "Pending order" },
            { name: "Completed", status: "waiting", detail: "Pending lifecycle" }
        ];
    }

    function update(payload = {}) {
        const pkg = payload.package || window.InstitutionalDecisionPackage?.current?.();
        const pipeline = {
            symbol: pkg?.symbol || null,
            timeframe: pkg?.timeframe || null,
            stages: buildStages(pkg),
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(KEY, JSON.stringify(pipeline));
        window.WorkspaceStore?.set?.("decisionStagePipeline", pipeline);
        window.EventBus?.publish?.("decision-stage-pipeline.updated", { pipeline });
        return pipeline;
    }

    function current() {
        try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
        catch { return null; }
    }

    window.EventBus?.subscribe?.("institutional-decision-package.updated", update);
    document.addEventListener("DOMContentLoaded", () => setTimeout(update, 1800));

    window.DecisionStagePipeline = {
        update,
        current,
    };
})();
