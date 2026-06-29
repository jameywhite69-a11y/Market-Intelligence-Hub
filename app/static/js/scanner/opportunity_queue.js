function momentumIcon(momentum) {
    if (momentum === "rising") return "▲";
    if (momentum === "falling") return "▼";
    if (momentum === "stable") return "■";
    return "NEW";
}

function renderOpportunityQueue(snapshot) {
    const queue = document.getElementById("opportunityQueue");
    if (!queue) return;

    if (!snapshot || !snapshot.ranked_opportunities?.length) {
        queue.innerHTML = window.uiEmptyStates
            ? window.uiEmptyStates.renderQuietEmptyState("Live Opportunities", "Awaiting first ranked scan")
            : "";
        return;
    }

    const rows = snapshot.ranked_opportunities.slice(0, 6);

    queue.innerHTML = `
        <div class="queue-header">
            <h3>Live Opportunities</h3>
            <span>${rows.length} ranked</span>
        </div>
        <div class="queue-cards">
            ${rows.map((item) => `
                <button class="queue-card" data-key="${item.symbol}:${item.timeframe}">
                    <b>#${item.rank} ${item.symbol}</b>
                    <span>${item.opportunity_score.toFixed(1)}</span>
                    <small>${momentumIcon(item.momentum)} ${item.classification}</small>
                    <em>${item.allocation_percent.toFixed(1)}% allocation</em>
                </button>
            `).join("")}
        </div>
    `;

    for (const button of queue.querySelectorAll("[data-key]")) {
        button.addEventListener("click", () => {
            if (window.scannerResults) {
                window.scannerResults.selectResult(button.dataset.key);
            }
        });
    }
}

window.opportunityQueue = {
    renderOpportunityQueue,
};
