/*
Version 63.0 — Market Context Store
Single source of truth for selected opportunity + market context.
No broker execution.
*/
(function () {
    const VERSION = "63.0";
    const STATE = {
        selected: null,
        marketContext: null,
        scannerResults: [],
        subscribers: new Set(),
        revision: 0
    };

    function clone(value) {
        try { return JSON.parse(JSON.stringify(value)); }
        catch { return value; }
    }

    function normalizeOpportunity(input) {
        const v = input?.value || input || {};
        return {
            symbol: v.symbol || "—",
            timeframe: v.timeframe || v.tf || "15m",
            score: Number(v.score ?? v.opportunityScore ?? v.validationScore ?? 0),
            confidence: Number(v.confidence ?? v.confidenceScore ?? v.score ?? 0),
            decision: v.decision || v.status || "WAIT",
            grade: v.grade || "—",
            expectedR: Number(v.expectedR ?? v.expectedReward ?? 0),
            allocation: Number(v.allocation ?? v.allocationPct ?? 0),
            risk: Number(v.risk ?? v.riskScore ?? 50),
            raw: clone(v)
        };
    }

    function snapshot() {
        return {
            version: VERSION,
            revision: STATE.revision,
            selected: clone(STATE.selected),
            marketContext: clone(STATE.marketContext),
            scannerResults: clone(STATE.scannerResults)
        };
    }

    function emit(reason) {
        STATE.revision += 1;
        const snap = snapshot();
        snap.reason = reason;

        STATE.subscribers.forEach(fn => {
            try { fn(snap); }
            catch (err) { console.warn("[MarketContextStoreV63 subscriber]", err); }
        });

        window.EventBus?.publish?.("market-context-store.updated", snap);
        return snap;
    }

    function setSelected(input, reason = "selection") {
        const next = normalizeOpportunity(input);
        const prevKey = STATE.selected ? `${STATE.selected.symbol}|${STATE.selected.timeframe}|${STATE.selected.score}` : "";
        const nextKey = `${next.symbol}|${next.timeframe}|${next.score}`;

        if (prevKey === nextKey) return snapshot();

        STATE.selected = next;
        return emit(reason);
    }

    function setMarketContext(context, reason = "market-context") {
        STATE.marketContext = clone(context?.context || context || {});
        return emit(reason);
    }

    function setScannerResults(results, reason = "scanner-results") {
        STATE.scannerResults = Array.isArray(results) ? clone(results) : [];
        if (!STATE.selected && STATE.scannerResults.length) {
            STATE.selected = normalizeOpportunity(STATE.scannerResults[0]);
        }
        return emit(reason);
    }

    function subscribe(fn) {
        STATE.subscribers.add(fn);
        setTimeout(() => fn(snapshot()), 0);
        return () => STATE.subscribers.delete(fn);
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => setScannerResults(payload?.results || [], "scanner.results.updated"));
        window.EventBus?.subscribe?.("scanner.selection.changed", payload => setSelected(payload, "scanner.selection.changed"));
        window.EventBus?.subscribe?.("unified-opportunity.changed", payload => {
            if (payload?.value) setSelected(payload.value, "unified-opportunity.changed");
        });
        window.EventBus?.subscribe?.("market-context.updated", payload => setMarketContext(payload?.context || payload, "market-context.updated"));
        window.EventBus?.subscribe?.("institutional-market-context.updated", payload => setMarketContext(payload, "institutional-market-context.updated"));

        setTimeout(() => {
            if (window.TIOSInstitutionalScannerV56?.latest?.length) {
                setScannerResults(window.TIOSInstitutionalScannerV56.latest, "bootstrap");
            }
            if (window.InstitutionalMarketContextEngineV62?.get?.()) {
                setMarketContext(window.InstitutionalMarketContextEngineV62.get(), "bootstrap-context");
            }
        }, 1600);
    }

    window.MarketContextStoreV63 = {
        setSelected,
        setMarketContext,
        setScannerResults,
        subscribe,
        snapshot,
        get: snapshot,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 900));
})();
