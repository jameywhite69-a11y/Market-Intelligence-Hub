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
    const labels = {
        new: "NEW",
        up: "▲",
        down: "▼",
        flat: "—",
    };

    return labels[change] || "—";
}

function renderResults(results) {
    scannerDom.resultCount.textContent =
        `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        scannerDom.resultsBody.innerHTML =
            `<tr><td colspan="9" class="empty-row">No matching results.</td></tr>`;
        return;
    }

    scannerDom.resultsBody.innerHTML = results.map((result) => {
        const grade = scannerUtils.gradeOf(result);
        const confidence = scannerUtils.confidenceOf(result);
        const warnings = result.warnings?.length ? result.warnings.join("; ") : "";
        const score = Number(result.score ?? 0);
        const key = scannerUtils.resultKey(result);
        const selected = key === scannerState.selectedKey ? "selected-row" : "";
        const change = rankChangeOf(result);

        return `
            <tr class="${selected} ${change === "new" ? "new-opportunity-row" : ""}" data-key="${key}">
                <td>${result.rank ?? ""}</td>
                <td class="rank-${change}">${rankChangeLabel(change)}</td>
                <td class="symbol-cell">${result.symbol}</td>
                <td>${result.timeframe}</td>
                <td class="${scannerUtils.scoreClass(score)}">${score.toFixed(1)}</td>
                <td><span class="badge badge-grade">${grade}</span></td>
                <td><span class="badge badge-confidence">${confidence}</span></td>
                <td>
                    <span class="status-pill status-${scannerUtils.statusOf(result).toLowerCase()}">
                        ${scannerUtils.statusOf(result)}
                    </span>
                </td>
                <td>${warnings}</td>
            </tr>
        `;
    }).join("");

    for (const row of scannerDom.resultsBody.querySelectorAll("tr[data-key]")) {
        row.addEventListener("click", () => selectResult(row.dataset.key));
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
