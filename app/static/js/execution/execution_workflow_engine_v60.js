/*
Version 60.0 — Execution Workflow Engine
Coordinates paper-only opportunity lifecycle:
Candidate -> Validated -> Risk Approved -> Sized -> Staged -> Submitted -> Filled -> Managing -> Closed.
No live broker orders.
*/
(function () {
    const VERSION = "60.0";

    const STATE = {
        current: null,
        queue: [],
        log: []
    };

    const STAGES = [
        "Candidate",
        "Validated",
        "Risk Approved",
        "Sized",
        "Staged",
        "Submitted",
        "Filled",
        "Managing",
        "Closed"
    ];

    function now() {
        return new Date().toLocaleTimeString();
    }

    function latestPlan() {
        return window.InstitutionalTradeEngineV59?.current
            || window.UnifiedDecisionEngineV57?.get?.()
            || {};
    }

    function makeWorkflow(input, source = "system") {
        const plan = input?.plan || input || latestPlan();
        const symbol = plan.symbol || "BTC";
        const score = Number(plan.score || 60);
        const readiness = plan.status || plan.readiness || "MONITOR";
        const riskDollars = Number(plan.riskDollars || 0);
        const notional = Number(plan.notional || 0);
        const expectedR = Number(plan.expectedR || 0);
        const confidence = Number(plan.confidence || score);

        const checks = {
            candidate: score >= 60,
            validated: score >= 72,
            riskApproved: riskDollars <= 750,
            sized: notional > 0,
            staged: readiness === "READY TO EXECUTE" || readiness === "STAGE PLAN",
            broker: true,
            capital: notional <= 25000
        };

        const passed = Object.values(checks).filter(Boolean).length;
        const stage =
            passed >= 7 ? "Staged" :
            passed >= 5 ? "Sized" :
            passed >= 4 ? "Risk Approved" :
            passed >= 3 ? "Validated" :
            "Candidate";

        return {
            id: `${symbol}-${Date.now()}`,
            version: VERSION,
            source,
            symbol,
            timeframe: plan.timeframe || "15m",
            score,
            confidence,
            expectedR,
            readiness,
            stage,
            checks,
            passed,
            entry: Number(plan.entry || 0),
            stop: Number(plan.stop || 0),
            tp1: Number(plan.tp1 || 0),
            tp2: Number(plan.tp2 || 0),
            units: Number(plan.units || 0),
            notional,
            riskDollars,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function addLog(message, payload) {
        const item = {
            time: now(),
            message,
            symbol: payload?.symbol || "",
            stage: payload?.stage || ""
        };
        STATE.log.unshift(item);
        STATE.log = STATE.log.slice(0, 50);
    }

    function setCurrent(workflow, reason = "updated") {
        STATE.current = workflow;

        const existing = STATE.queue.findIndex(x => x.symbol === workflow.symbol);
        if (existing >= 0) {
            STATE.queue[existing] = workflow;
        } else {
            STATE.queue.unshift(workflow);
        }

        STATE.queue = STATE.queue
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        addLog(`${reason}: ${workflow.symbol} -> ${workflow.stage}`, workflow);

        window.EventBus?.publish?.("execution-workflow.updated", {
            workflow,
            queue: STATE.queue,
            log: STATE.log
        });

        render();
        return workflow;
    }

    function advance(nextStage) {
        if (!STATE.current) return null;
        const workflow = {
            ...STATE.current,
            stage: nextStage,
            updatedAt: new Date().toISOString()
        };
        return setCurrent(workflow, "stage advanced");
    }

    function buildFromPlan(payload) {
        const workflow = makeWorkflow(payload, "trade-plan");
        return setCurrent(workflow, "workflow built");
    }

    function render() {
        const panel = document.getElementById("executionWorkflowEnginePanel");
        if (!panel) return;

        const wf = STATE.current || makeWorkflow({}, "bootstrap");

        panel.innerHTML = `
            <section class="v60-workflow-card">
                <div class="v60-header">
                    <div>
                        <h2>Execution Workflow Engine</h2>
                        <span>${wf.symbol} · ${wf.timeframe} · ${wf.source}</span>
                    </div>
                    <strong>${wf.stage}</strong>
                </div>

                <div class="v60-stage-track">
                    ${STAGES.map(stage => `
                        <div class="${stage === wf.stage ? "active" : STAGES.indexOf(stage) < STAGES.indexOf(wf.stage) ? "complete" : ""}">
                            <b>${STAGES.indexOf(stage) + 1}</b>
                            <span>${stage}</span>
                        </div>
                    `).join("")}
                </div>

                <div class="v60-summary-grid">
                    <div><small>Score</small><b>${wf.score.toFixed(1)}</b></div>
                    <div><small>Confidence</small><b>${wf.confidence.toFixed(1)}%</b></div>
                    <div><small>Expected R</small><b>${wf.expectedR.toFixed(2)}R</b></div>
                    <div><small>Risk</small><b>$${wf.riskDollars.toFixed(2)}</b></div>
                    <div><small>Notional</small><b>$${wf.notional.toFixed(2)}</b></div>
                    <div><small>Units</small><b>${wf.units}</b></div>
                </div>

                <div class="v60-action-row">
                    ${["Submitted", "Filled", "Managing", "Closed"].map(stage => `
                        <button type="button" data-v60-stage="${stage}">Mark ${stage}</button>
                    `).join("")}
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-v60-stage]").forEach(button => {
            button.addEventListener("click", () => advance(button.dataset.v60Stage));
        });
    }

    function wire() {
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", payload => buildFromPlan(payload?.plan || payload));
        window.EventBus?.subscribe?.("institutional-decision.updated", payload => buildFromPlan(payload));
        setTimeout(() => buildFromPlan(latestPlan()), 1300);
    }

    window.ExecutionWorkflowEngineV60 = {
        buildFromPlan,
        advance,
        render,
        get: () => STATE.current,
        queue: () => STATE.queue.slice(),
        log: () => STATE.log.slice(),
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 900));
})();
