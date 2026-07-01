/*
Version 46.1 — Decision Pipeline Monitor
Tracks decision-pipeline stages from scanner selection through decision output.
*/

(function () {
    const KEY = "tios.decision.pipeline.v46_1";
    const STAGES = [
        "Scanner Selection",
        "Unified Opportunity",
        "Workspace Context",
        "Decision Engine",
        "AI Layer",
        "Risk Layer",
        "Portfolio Layer",
        "Execution Layer",
        "Timeline",
        "Automation"
    ];

    let pipeline = load();

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "null") || resetPipeline();
        } catch {
            return resetPipeline();
        }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(pipeline));
    }

    function resetPipeline() {
        return {
            startedAt: null,
            updatedAt: null,
            symbol: null,
            timeframe: null,
            stages: STAGES.map(name => ({
                name,
                status: "waiting",
                timestamp: null,
                latencyMs: null,
                detail: ""
            }))
        };
    }

    function mark(stageName, status = "ok", detail = "", payload = {}) {
        const now = Date.now();

        if (!pipeline.startedAt || stageName === "Scanner Selection") {
            pipeline = resetPipeline();
            pipeline.startedAt = now;
            pipeline.symbol = payload.symbol || payload.opportunity?.symbol || null;
            pipeline.timeframe = payload.timeframe || payload.opportunity?.timeframe || null;
        }

        const stage = pipeline.stages.find(row => row.name === stageName);
        if (stage) {
            stage.status = status;
            stage.timestamp = now;
            stage.latencyMs = pipeline.startedAt ? now - pipeline.startedAt : 0;
            stage.detail = detail || "";
        }

        pipeline.updatedAt = now;
        save();

        window.WorkspaceStore?.set?.("decisionPipeline", snapshot());
        window.EventBus?.publish?.("decision-pipeline.updated", snapshot());

        return snapshot();
    }

    function snapshot() {
        return JSON.parse(JSON.stringify(pipeline));
    }

    function currentLatency() {
        if (!pipeline.startedAt || !pipeline.updatedAt) return 0;
        return pipeline.updatedAt - pipeline.startedAt;
    }

    window.EventBus?.subscribe?.("scanner.result.selected", payload =>
        mark("Scanner Selection", "ok", "Scanner row clicked", payload)
    );

    window.EventBus?.subscribe?.("unified-opportunity.changed", payload =>
        mark("Unified Opportunity", "ok", "Canonical opportunity updated", payload)
    );

    window.EventBus?.subscribe?.("workspace.context.changed", payload =>
        mark("Workspace Context", "ok", "Workspace context synchronized", payload)
    );

    window.EventBus?.subscribe?.("decision.updated", payload =>
        mark("Decision Engine", "ok", payload?.decision?.recommendation || "Decision generated", payload)
    );

    window.EventBus?.subscribe?.("ai.decision.updated", payload =>
        mark("AI Layer", "ok", "AI decision updated", payload)
    );

    window.EventBus?.subscribe?.("risk.assessed", payload =>
        mark("Risk Layer", "ok", payload?.decision || "Risk assessed", payload)
    );

    window.EventBus?.subscribe?.("portfolio-intelligence.updated", payload =>
        mark("Portfolio Layer", "ok", "Portfolio updated", payload)
    );

    window.EventBus?.subscribe?.("execution.snapshot.updated", payload =>
        mark("Execution Layer", "ok", "Execution snapshot updated", payload)
    );

    window.EventBus?.subscribe?.("activity.timeline.updated", payload =>
        mark("Timeline", "ok", "Timeline recorded", payload)
    );

    window.EventBus?.subscribe?.("workspace.sync.completed", payload =>
        mark("Automation", "ok", "Workspace synchronization completed", payload)
    );

    window.DecisionPipelineMonitor = {
        mark,
        snapshot,
        reset: () => {
            pipeline = resetPipeline();
            save();
            window.EventBus?.publish?.("decision-pipeline.updated", snapshot());
            return snapshot();
        },
        currentLatency
    };
})();
