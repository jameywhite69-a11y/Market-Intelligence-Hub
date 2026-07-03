/*
Version 69.0 — Institutional Workflow Automation Engine
Purpose:
- Paper/simulation automation only.
- Converts scanner/context/portfolio/execution state into automation recommendations.
- Does not submit live broker orders.
*/
(function () {
    const VERSION = "69.0";

    const STATE = {
        enabled: false,
        rules: [
            { id: "elite-candidate", name: "Elite Candidate", enabled: true, action: "Stage Paper Order" },
            { id: "risk-budget", name: "Risk Budget Guard", enabled: true, action: "Block / Reduce Size" },
            { id: "market-context", name: "Market Context Guard", enabled: true, action: "Require Confirmation" },
            { id: "portfolio-heat", name: "Portfolio Heat Guard", enabled: true, action: "Reduce Allocation" }
        ],
        decisions: [],
        events: []
    };

    function log(message, data) {
        STATE.events.unshift({
            time: new Date().toLocaleTimeString(),
            message,
            data: data || {}
        });
        STATE.events = STATE.events.slice(0, 100);
    }

    function snapshotSources() {
        return {
            context: window.MarketContextStoreV63?.get?.() || {},
            portfolio: window.PortfolioIntelligenceStoreV64?.get?.() || {},
            tradePlan: window.InstitutionalTradeEngineV59?.current || {},
            workflow: window.ExecutionWorkflowEngineV60?.get?.() || {},
            market: window.InstitutionalMarketContextEngineV62?.get?.() || {}
        };
    }

    function evaluate() {
        const s = snapshotSources();
        const selected = s.context.selected || {};
        const market = s.market || s.context.marketContext || {};
        const workflow = s.workflow || {};
        const score = Number(selected.score || workflow.score || 0);
        const confidence = Number(selected.confidence || workflow.confidence || 0);
        const marketPermission = market.tradePermission || "Normal Watch";
        const portfolioPositions = s.portfolio.positions || [];
        const grossExposure = portfolioPositions
            .filter(p => p.assetClass !== "Cash")
            .reduce((a, p) => a + Number(p.notional || 0), 0);
        const riskUsed = portfolioPositions.reduce((a, p) => a + Number(p.risk || 0), 0);

        const decisions = [];

        if (score >= 90 && confidence >= 80 && !["Defense Only", "Reduce / Avoid"].includes(marketPermission)) {
            decisions.push({
                rule: "Elite Candidate",
                result: "PASS",
                action: STATE.enabled ? "Auto-stage paper order" : "Recommend stage paper order",
                severity: "positive"
            });
        } else {
            decisions.push({
                rule: "Elite Candidate",
                result: "WAIT",
                action: "Do not stage automatically",
                severity: "neutral"
            });
        }

        if (riskUsed > 1200) {
            decisions.push({
                rule: "Risk Budget Guard",
                result: "BLOCK",
                action: "Risk budget constrained",
                severity: "danger"
            });
        } else {
            decisions.push({
                rule: "Risk Budget Guard",
                result: "PASS",
                action: "Risk budget available",
                severity: "positive"
            });
        }

        if (["Defense Only", "Reduce / Avoid", "Reduced Size"].includes(marketPermission)) {
            decisions.push({
                rule: "Market Context Guard",
                result: "REDUCE",
                action: marketPermission,
                severity: "warning"
            });
        } else {
            decisions.push({
                rule: "Market Context Guard",
                result: "PASS",
                action: marketPermission,
                severity: "positive"
            });
        }

        if (grossExposure > 45000) {
            decisions.push({
                rule: "Portfolio Heat Guard",
                result: "REDUCE",
                action: "Exposure elevated",
                severity: "warning"
            });
        } else {
            decisions.push({
                rule: "Portfolio Heat Guard",
                result: "PASS",
                action: "Exposure controlled",
                severity: "positive"
            });
        }

        STATE.decisions = decisions;
        log("Automation evaluated", { symbol: selected.symbol, score, marketPermission });
        publish();
        render();
        return decisions;
    }

    function maybeStagePaperOrder() {
        const pass = STATE.decisions.some(d => d.rule === "Elite Candidate" && d.result === "PASS");
        const blocked = STATE.decisions.some(d => d.result === "BLOCK");

        if (!STATE.enabled || !pass || blocked) {
            log("Automation did not stage order", { enabled: STATE.enabled, pass, blocked });
            publish();
            render();
            return false;
        }

        const order = window.ExecutionServiceV65?.stageOrder?.();
        log("Automation staged paper order", order);
        publish();
        render();
        return true;
    }

    function setEnabled(value) {
        STATE.enabled = !!value;
        log(STATE.enabled ? "Automation enabled" : "Automation disabled");
        publish();
        render();
    }

    function publish() {
        window.EventBus?.publish?.("workflow-automation.updated", snapshot());
    }

    function snapshot() {
        return {
            version: VERSION,
            enabled: STATE.enabled,
            rules: STATE.rules.slice(),
            decisions: STATE.decisions.slice(),
            events: STATE.events.slice()
        };
    }

    function render() {
        const panel = document.getElementById("workflowAutomationEnginePanelV69");
        if (!panel) return;

        const s = snapshot();

        panel.innerHTML = `
            <section class="v69-card">
                <div class="v69-header">
                    <div>
                        <h2>Workflow Automation Engine</h2>
                        <span>paper automation · explicit control required</span>
                    </div>
                    <strong>${s.enabled ? "ENABLED" : "DISABLED"}</strong>
                </div>

                <div class="v69-action-row">
                    <button id="v69ToggleAutomation">${s.enabled ? "Disable" : "Enable"} Automation</button>
                    <button id="v69EvaluateAutomation">Evaluate Rules</button>
                    <button id="v69StagePaperIfAllowed">Stage Paper If Allowed</button>
                </div>

                <div class="v69-rule-list">
                    ${s.decisions.map(d => `
                        <div class="${d.severity}">
                            <b>${d.rule}</b>
                            <span>${d.result}</span>
                            <em>${d.action}</em>
                        </div>
                    `).join("") || "<div class='v69-empty'>Click Evaluate Rules.</div>"}
                </div>
            </section>
        `;

        document.getElementById("v69ToggleAutomation")?.addEventListener("click", () => setEnabled(!STATE.enabled));
        document.getElementById("v69EvaluateAutomation")?.addEventListener("click", evaluate);
        document.getElementById("v69StagePaperIfAllowed")?.addEventListener("click", maybeStagePaperOrder);
    }

    function wire() {
        window.EventBus?.subscribe?.("market-context-store.updated", evaluate);
        window.EventBus?.subscribe?.("portfolio-intelligence-store.updated", evaluate);
        window.EventBus?.subscribe?.("execution-workflow.updated", evaluate);
        setTimeout(() => {
            evaluate();
            render();
        }, 1800);
    }

    window.WorkflowAutomationEngineV69 = {
        evaluate,
        maybeStagePaperOrder,
        setEnabled,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
