function compareResults(a, b, field) {
    const accessors = {
        rank: row => Number(row.rank ?? 0),
        symbol: row => row.symbol || "",
        timeframe: row => row.timeframe || "",
        score: row => Number(row.score ?? 0),
        grade: row => scannerUtils.gradeOf(row),
        confidence: row => scannerUtils.confidenceOf(row),
    };

    const getter = accessors[field] || accessors.rank;
    const left = getter(a);
    const right = getter(b);

    if (typeof left === "number" && typeof right === "number") {
        return left - right;
    }

    return String(left).localeCompare(String(right));
}

function applyFiltersAndSort() {
    const minScore = Number(scannerDom.minScoreInput?.value || 0);
    const gradeFilter = scannerDom.gradeFilterSelect?.value || "all";
    const confidenceFilter = scannerDom.confidenceFilterSelect?.value || "all";

    let rows = scannerState.results.filter(result => {
        const score = Number(result.score ?? 0);

        return (
            score >= minScore &&
            (gradeFilter === "all" || scannerUtils.gradeOf(result) === gradeFilter) &&
            (confidenceFilter === "all" || scannerUtils.confidenceOf(result) === confidenceFilter)
        );
    });

    rows.sort((a, b) => compareResults(a, b, scannerState.sortField));

    if (scannerState.sortDirection === "desc") {
        rows.reverse();
    }

    scannerState.filteredResults = rows;
    scannerResults.renderResults(rows);
}

function bindFilteringAndSorting() {
    for (const header of document.querySelectorAll("[data-sort]")) {
        header.addEventListener("click", () => {
            const field = header.dataset.sort;

            if (scannerState.sortField === field) {
                scannerState.sortDirection =
                    scannerState.sortDirection === "asc" ? "desc" : "asc";
            } else {
                scannerState.sortField = field;
                scannerState.sortDirection = field === "score" ? "desc" : "asc";
            }

            applyFiltersAndSort();
        });
    }

    for (const control of [
        scannerDom.minScoreInput,
        scannerDom.gradeFilterSelect,
        scannerDom.confidenceFilterSelect,
    ]) {
        control?.addEventListener("input", applyFiltersAndSort);
        control?.addEventListener("change", applyFiltersAndSort);
    }
}

window.scannerFilters = {
    applyFiltersAndSort,
    bindFilteringAndSorting,
};
