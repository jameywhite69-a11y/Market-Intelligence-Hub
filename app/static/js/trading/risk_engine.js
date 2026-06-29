/*
Version 34.0 — Risk Engine

Calculates paper/live-compatible order risk using selected trade context.
*/

(function () {
    const DEFAULT_ACCOUNT_SIZE = 100000;
    const DEFAULT_RISK_PERCENT = 1.0;

    function calculateRisk({
        entry,
        stop,
        target,
        accountSize = DEFAULT_ACCOUNT_SIZE,
        riskPercent = DEFAULT_RISK_PERCENT,
        maxAllocationPercent = 25,
    }) {
        const entryPrice = Number(entry || 0);
        const stopPrice = Number(stop || 0);
        const targetPrice = Number(target || 0);
        const account = Number(accountSize || DEFAULT_ACCOUNT_SIZE);
        const riskPct = Number(riskPercent || DEFAULT_RISK_PERCENT);

        const riskPerShare = Math.abs(entryPrice - stopPrice);
        const dollarRisk = account * (riskPct / 100);
        const rawQuantity = riskPerShare > 0 ? dollarRisk / riskPerShare : 0;
        const maxNotional = account * (maxAllocationPercent / 100);
        const maxQuantity = entryPrice > 0 ? maxNotional / entryPrice : 0;
        const quantity = Math.max(0, Math.min(rawQuantity, maxQuantity));
        const notional = quantity * entryPrice;
        const reward = Math.abs(targetPrice - entryPrice) * quantity;
        const expectedR = dollarRisk > 0 ? reward / dollarRisk : 0;

        return {
            entryPrice,
            stopPrice,
            targetPrice,
            riskPerShare,
            dollarRisk,
            quantity,
            notional,
            maxNotional,
            reward,
            expectedR,
            riskPercent: riskPct,
            maxAllocationPercent,
        };
    }

    function estimateFromContext(context) {
        const raw = context?.raw || {};
        const price = Number(raw.price || raw.current_price || raw.close || 199);
        const entry = price;
        const stop = price * 0.97;
        const target = price * 1.04;

        return calculateRisk({ entry, stop, target });
    }

    window.RiskEngine = {
        calculateRisk,
        estimateFromContext,
    };
})();
