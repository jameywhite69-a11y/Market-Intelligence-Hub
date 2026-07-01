/*
Version 45.0 — Unified Opportunity Store

Creates one canonical selected opportunity object for TIOS.
All panels can read from this instead of keeping separate local copies.
*/

(function () {
    const KEY = "tios.unified.selectedOpportunity.v45";
    let current = load();

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "null");
        } catch {
            return null;
        }
    }

    function save(opportunity) {
        localStorage.setItem(KEY, JSON.stringify(opportunity));
    }

    function normalize(input = {}, source = "unknown") {
        const opportunity = input.opportunity || input.selectedOpportunity || input;
        const symbol = String(opportunity.symbol || opportunity.ticker || "UNKNOWN").toUpperCase();

        return {
            id: opportunity.id || `${symbol}:${opportunity.timeframe || "15m"}:${Date.now()}`,
            symbol,
            timeframe: opportunity.timeframe || opportunity.tf || "15m",
            score: Number(opportunity.score || opportunity.overall_score || opportunity.opportunity || 0),
            grade: opportunity.grade || opportunity.decision || "C",
            confidence: opportunity.confidence || opportunity.confidence_label || "Medium",
            expectedR: Number(opportunity.expectedR || opportunity.expected_r || opportunity.expected_r_multiple || 0),
            allocation: Number(opportunity.allocation || opportunity.recommended_allocation || 0),
            strategy: opportunity.strategy || opportunity.strategy_name || "Unassigned",
            status: opportunity.status || "Selected",
            source,
            raw: opportunity,
            updatedAt: new Date().toISOString(),
        };
    }

    function set(opportunity, source = "unknown") {
        current = normalize(opportunity, source);
        save(current);

        window.WorkspaceStore?.set?.("unifiedOpportunity", current);
        window.WorkspaceContext?.update?.({
            symbol: current.symbol,
            timeframe: current.timeframe,
            selectedOpportunity: current,
            strategy: current.strategy,
        }, "unified-opportunity-store");

        window.EventBus?.publish?.("unified-opportunity.changed", {
            opportunity: current,
            source,
        });

        return current;
    }

    function get() {
        return current;
    }

    function clear() {
        current = null;
        localStorage.removeItem(KEY);
        window.WorkspaceStore?.set?.("unifiedOpportunity", null);
        window.EventBus?.publish?.("unified-opportunity.cleared", {});
    }

    function hydrateFromExistingSelection() {
        const existing =
            window.OpportunityStore?.getSelectedOpportunity?.() ||
            window.WorkspaceContext?.snapshot?.()?.selectedOpportunity;

        if (existing) {
            set(existing, "hydrate-existing-selection");
        }
    }

    window.EventBus?.subscribe?.("opportunity:selected", payload => set(payload?.opportunity || payload, "opportunity:selected"));
    window.EventBus?.subscribe?.("scanner.result.selected", payload => set(payload?.opportunity || payload, "scanner.result.selected"));
    window.EventBus?.subscribe?.("strategy-registry.selected", payload => {
        const existing = get();
        if (existing && payload?.strategy) {
            set({ ...existing, strategy: payload.strategy.name || payload.strategy.strategy_id }, "strategy-registry.selected");
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            if (current) {
                window.WorkspaceStore?.set?.("unifiedOpportunity", current);
                window.EventBus?.publish?.("unified-opportunity.changed", { opportunity: current, source: "localStorage" });
            } else {
                hydrateFromExistingSelection();
            }
        }, 650);
    });

    window.UnifiedOpportunityStore = {
        set,
        get,
        clear,
        normalize,
        hydrateFromExistingSelection,
    };
})();
