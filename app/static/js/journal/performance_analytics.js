/*
Version 43.1 — Performance Analytics
Calculates basic journal analytics from locally persisted trades.
*/
(function () {
    function calculate(entries = window.TradeJournalStore?.list?.(1000) || []) {
        const rows = entries.slice();
        const closed = rows.filter(row => row.status === "Closed" && Number(row.exitPrice) > 0 && Number(row.entryPrice) > 0);

        let wins = 0;
        let losses = 0;
        let grossWin = 0;
        let grossLoss = 0;
        let totalR = 0;

        for (const row of closed) {
            const sideMultiplier = row.side === "sell" ? -1 : 1;
            const pnl = (Number(row.exitPrice) - Number(row.entryPrice)) * Number(row.quantity) * sideMultiplier;
            const riskBasis = Math.max(0.0001, Number(row.entryPrice) * 0.03 * Number(row.quantity || 1));
            const r = pnl / riskBasis;

            totalR += r;

            if (pnl >= 0) {
                wins += 1;
                grossWin += pnl;
            } else {
                losses += 1;
                grossLoss += Math.abs(pnl);
            }
        }

        const total = closed.length;
        const winRate = total ? (wins / total) * 100 : 0;
        const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 999 : 0;
        const expectancy = total ? totalR / total : 0;

        return {
            totalTrades: rows.length,
            closedTrades: total,
            openTrades: rows.filter(row => row.status !== "Closed").length,
            wins,
            losses,
            winRate,
            grossWin,
            grossLoss,
            profitFactor,
            expectancy,
        };
    }

    window.PerformanceAnalytics = { calculate };
})();
