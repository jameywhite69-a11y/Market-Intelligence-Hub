function exportCsv() {
    const rows = scannerState.filteredResults.length
        ? scannerState.filteredResults
        : scannerState.results;

    if (!rows.length) {
        scannerStatus.setStatus("No results to export.", "error");
        return;
    }

    const headers = ["rank", "change", "symbol", "timeframe", "score", "grade", "confidence", "status"];

    const csvRows = [
        headers.join(","),
        ...rows.map(result => [
            result.rank ?? "",
            scannerResults.rankChangeLabel(scannerResults.rankChangeOf(result)),
            result.symbol,
            result.timeframe,
            Number(result.score ?? 0).toFixed(1),
            scannerUtils.gradeOf(result),
            scannerUtils.confidenceOf(result),
            scannerUtils.statusOf(result),
        ].map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `scanner_results_${new Date().toISOString().replaceAll(":", "-")}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
    scannerStatus.setStatus("CSV exported.", "success");
}

window.scannerExport = {
    exportCsv,
};
