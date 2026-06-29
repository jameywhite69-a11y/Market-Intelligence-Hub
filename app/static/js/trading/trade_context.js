/*
Version 34.0 — Trade Context

Single selected-opportunity object shared by decision, terminal, paper trading,
risk, lifecycle, and future chart/broker modules.
*/

(function () {
    let current = null;

    function normalizeResult(result) {
        if (!result) return null;

        return {
            key: window.scannerUtils ? scannerUtils.resultKey(result) : `${result.symbol}-${result.timeframe}`,
            symbol: result.symbol,
            timeframe: result.timeframe,
            rank: result.rank ?? null,
            score: Number(result.score ?? 0),
            grade: window.scannerUtils ? scannerUtils.gradeOf(result) : result.grade ?? "C",
            confidence: window.scannerUtils ? scannerUtils.confidenceOf(result) : result.confidence ?? "Medium",
            status: window.scannerUtils ? scannerUtils.statusOf(result) : result.status ?? "Watch",
            expectedR: Math.max(1, Number(result.score ?? 0) / 25),
            allocation: 0,
            raw: result,
            selectedAt: new Date().toISOString(),
        };
    }

    function setSelectedOpportunity(result) {
        const context = normalizeResult(result);
        current = context;

        if (window.EventBus) {
            EventBus.publish("trade-context:selected", context);
            EventBus.publish("trade-selected", context);
        }

        return context;
    }

    function getCurrent() {
        return current;
    }

    function clear() {
        current = null;
        window.EventBus?.publish("trade-context:cleared", {});
    }

    window.TradeContext = {
        setSelectedOpportunity,
        getCurrent,
        clear,
    };
})();
