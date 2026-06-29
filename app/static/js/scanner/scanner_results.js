function rankChangeOf(result) {
    const previous = scannerState.previousResults.find(
        item => scannerUtils.resultKey(item) === scannerUtils.resultKey(result)
    );

    if (!previous || previous.rank === null || result.rank === null) return "new";
    if (result.rank < previous.rank) return "up";
    if (result.rank > previous.rank) return "down";
    return "flat";
}

function rankChangeLabel(change) {
    const labels = { new: "NEW", up: "▲", down: "▼", flat: "—" };
    return labels[change] || "—";
}

function institutionalScore(result) {
    return Number(result.score ?? 0);
}

function expectedR(result) {
    return Math.max(1, Number(result.score ?? 0) / 25);
}

function allocation(result) {
    const total = scannerState.filteredResults.reduce((sum, row) => sum + institutionalScore(row), 0) || 1;
    return (institutionalScore(result) / total) * 100;
}

function renderResults(results) {
    scannerDom.resultCount.textContent =
        `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        scannerDom.resultsBody.innerHTML =
            `<tr><td colspan="12" class="empty-row">No matching results.</td></tr>`;
        return;
    }

    scannerDom.resultsBody.innerHTML = results.map((result) => {
        const grade = scannerUtils.gradeOf(result);
        const confidence = scannerUtils.confidenceOf(result);
        const status = scannerUtils.statusOf(result);
        const score = Number(result.score ?? 0);
        const key = scannerUtils.resultKey(result);
        const selected = key === scannerState.selectedKey ? "selected-row" : "";
        const change = rankChangeOf(result);

        return `
            <tr class="${selected} ${change === "new" ? "new-opportunity-row" : ""}" data-key="${key}">
                <td>${result.rank ?? ""}</td>
                <td class="symbol-cell">${result.symbol}</td>
                <td>${result.timeframe}</td>
                <td class="${scannerUtils.scoreClass(score)}">${institutionalScore(result).toFixed(1)}</td>
                <td><span class="badge badge-grade">${grade}</span></td>
                <td><span class="badge badge-confidence">${confidence}</span></td>
                <td>${expectedR(result).toFixed(2)}R</td>
                <td>${allocation(result).toFixed(1)}%</td>
                <td class="rank-${change}">${rankChangeLabel(change)}</td>
                <td><span class="status-pill status-${status.toLowerCase()}">${status}</span></td>
                <td>
                    <button class="paper-buy-button" data-key="${key}">Buy</button>
                    <button class="paper-sell-button" data-key="${key}">Sell</button>
                </td>
                <td>${result.warnings?.length ? result.warnings.join("; ") : ""}</td>
            </tr>
        `;
    }).join("");

    for (const row of scannerDom.resultsBody.querySelectorAll("tr[data-key]")) {
        row.addEventListener("click", event => {
            if (event.target.tagName.toLowerCase() === "button") return;
            selectResult(row.dataset.key);
        });
    }

    for (const button of scannerDom.resultsBody.querySelectorAll(".paper-buy-button")) {
        button.addEventListener("click", () => {
            const result = scannerState.results.find(item => scannerUtils.resultKey(item) === button.dataset.key);
            if (result) window.paperTradingPanel?.submitPaperOrderFromResult(result, "buy");
        });
    }

    for (const button of scannerDom.resultsBody.querySelectorAll(".paper-sell-button")) {
        button.addEventListener("click", () => {
            const result = scannerState.results.find(item => scannerUtils.resultKey(item) === button.dataset.key);
            if (result) window.paperTradingPanel?.submitPaperOrderFromResult(result, "sell");
        });
    }
}

async function selectResult(key) {
    scannerState.selectedKey = key;

    const result = scannerState.results.find(
        item => scannerUtils.resultKey(item) === key
    );

    if (!result) return;

    if (window.opportunityPanel) {
        await window.opportunityPanel.renderOpportunityPanel(result);
    }

    renderResults(scannerState.filteredResults);
}

window.scannerResults = {
    renderResults,
    rankChangeOf,
    rankChangeLabel,
    selectResult,
};
