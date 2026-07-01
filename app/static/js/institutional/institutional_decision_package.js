/*
Version 48.0 — Institutional Decision Package
Creates a complete decision package from institutional score, consensus, ranking, and selected opportunity.
*/

(function () {
    const KEY = "tios.institutional.decision.package.v48";

    function currentSources() {
        return {
            opportunity: window.UnifiedOpportunityStore?.get?.() || null,
            decision: window.DecisionEngine?.current?.() || null,
            institutionalScore: window.InstitutionalScoringEngine?.current?.() || null,
            consensus: window.StrategyConsensusEngine?.current?.() || null,
            ranking: window.OpportunityRankingEngine?.current?.() || null,
            context: window.WorkspaceContext?.snapshot?.() || null,
        };
    }

    function riskLabel(score) {
        if (score >= 88) return "Low";
        if (score >= 75) return "Moderate";
        if (score >= 65) return "Elevated";
        return "High";
    }

    function entryStatus(pkg) {
        if (pkg.recommendation === "EXECUTE") return "Execution Ready";
        if (pkg.recommendation === "QUALIFIED") return "Qualified — Confirm";
        if (pkg.recommendation === "WATCH") return "Watchlist";
        return "Stand Down";
    }

    function build(reason = "manual") {
        const src = currentSources();
        const score = src.institutionalScore;
        const decision = src.decision;
        const opportunity = src.opportunity;

        if (!score || !decision || !opportunity) return null;

        const riskScore = Number(score.components?.riskQuality || decision.institutionalScore?.risk || 0);
        const allocation = Number(opportunity.allocation || decision.opportunity?.allocation || 0);
        const expectedR = Number(opportunity.expectedR || decision.opportunity?.expectedR || 0);

        const pkg = {
            id: `${score.symbol}:${score.timeframe}:${Date.now()}`,
            symbol: score.symbol,
            timeframe: score.timeframe,
            strategy: score.strategy || opportunity.strategy || "Unassigned",
            recommendation: score.institutionalState,
            entryStatus: null,
            grade: score.grade,
            institutionalScore: score.overall,
            confidence: Number(decision.confidence || score.overall || 0),
            expectedR,
            allocation,
            riskLevel: riskLabel(riskScore),
            riskScore,
            strategyConsensus: {
                passCount: src.consensus?.passCount || 0,
                total: src.consensus?.total || 0,
                alignment: src.consensus?.alignment || 0,
                recommendation: src.consensus?.recommendation || "Unknown",
            },
            ranking: {
                rankScore: src.ranking?.rankScore || score.overall,
                capitalPriority: src.ranking?.capitalPriority || "Medium",
            },
            summary: "",
            sources: src,
            createdAt: new Date().toISOString(),
            reason,
        };

        pkg.entryStatus = entryStatus(pkg);
        pkg.summary = buildSummary(pkg);

        localStorage.setItem(KEY, JSON.stringify(pkg));
        window.WorkspaceStore?.set?.("institutionalDecisionPackage", pkg);
        window.EventBus?.publish?.("institutional-decision-package.updated", { package: pkg });
        return pkg;
    }

    function buildSummary(pkg) {
        if (pkg.recommendation === "EXECUTE") {
            return `${pkg.symbol} is execution ready. Institutional score is ${pkg.institutionalScore}, consensus alignment is ${pkg.strategyConsensus.alignment}%, risk is ${pkg.riskLevel}, and expected reward is ${pkg.expectedR.toFixed(2)}R.`;
        }

        if (pkg.recommendation === "QUALIFIED") {
            return `${pkg.symbol} is qualified but requires final confirmation. Consensus and risk are acceptable, but the trade should remain under review until execution quality improves.`;
        }

        if (pkg.recommendation === "WATCH") {
            return `${pkg.symbol} is on watch. The opportunity is developing but does not yet meet full institutional execution standards.`;
        }

        return `${pkg.symbol} should not be executed under current conditions. Preserve capital and wait for stronger alignment.`;
    }

    function current() {
        try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
        catch { return null; }
    }

    window.EventBus?.subscribe?.("institutional-score.updated", () => setTimeout(() => build("institutional-score.updated"), 80));
    window.EventBus?.subscribe?.("strategy-consensus.updated", () => setTimeout(() => build("strategy-consensus.updated"), 80));
    window.EventBus?.subscribe?.("opportunity-ranking.updated", () => setTimeout(() => build("opportunity-ranking.updated"), 80));
    window.EventBus?.subscribe?.("decision.updated", () => setTimeout(() => build("decision.updated"), 120));

    document.addEventListener("DOMContentLoaded", () => setTimeout(() => build("startup"), 1600));

    window.InstitutionalDecisionPackage = {
        build,
        current,
        currentSources,
    };
})();
