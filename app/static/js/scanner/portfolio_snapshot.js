function buildLocalPortfolioSnapshot(results) {
    if (!results?.length) {
        return {
            top_opportunity: null,
            highest_confidence: null,
            best_risk_reward: null,
            largest_allocation: null,
            ranked_opportunities: [],
        };
    }

    const ranked = results.map((result, index) => {
        const score = Number(result.score || 0);
        return {
            rank: index + 1,
            symbol: result.symbol,
            timeframe: result.timeframe,
            opportunity_score: score,
            decision_score: score,
            confidence_score: score,
            strategy_score: score,
            expected_r: Math.max(1, score / 25),
            allocation_percent: 0,
            momentum: "new",
            classification: scannerUtils.gradeOf(result),
            recommendation: scannerUtils.statusOf(result),
        };
    }).sort((a, b) => b.opportunity_score - a.opportunity_score);

    const total = ranked.reduce((sum, item) => sum + item.opportunity_score, 0) || 1;
    ranked.forEach((item, index) => {
        item.rank = index + 1;
        item.allocation_percent = (item.opportunity_score / total) * 100;
    });

    return {
        top_opportunity: ranked[0] || null,
        highest_confidence: ranked[0] || null,
        best_risk_reward: ranked[0] || null,
        largest_allocation: ranked[0] || null,
        ranked_opportunities: ranked,
    };
}

function renderPortfolioCards(snapshot) {
    const panel = document.getElementById("portfolioSummaryCards");
    if (!panel) return;

    if (!snapshot || !snapshot.ranked_opportunities?.length) {
        panel.innerHTML = "";
        return;
    }

    const card = (label, item, value) => `
        <div class="portfolio-card">
            <b>${label}</b>
            <span>${item?.symbol || "-"}</span>
            <small>${value || ""}</small>
        </div>
    `;

    panel.innerHTML = `
        ${card("Top Opportunity", snapshot.top_opportunity, snapshot.top_opportunity?.opportunity_score?.toFixed(1))}
        ${card("Highest Confidence", snapshot.highest_confidence, snapshot.highest_confidence?.confidence_score?.toFixed(1))}
        ${card("Best R:R", snapshot.best_risk_reward, `${snapshot.best_risk_reward?.expected_r?.toFixed(2)}R`)}
        ${card("Largest Allocation", snapshot.largest_allocation, `${snapshot.largest_allocation?.allocation_percent?.toFixed(1)}%`)}
    `;
}

window.portfolioSnapshot = {
    buildLocalPortfolioSnapshot,
    renderPortfolioCards,
};
