/*
Version 45.0 hotfix — Scanner Selection Unifier
Bridges existing scanner selections into the Unified Opportunity Store.
*/

(function () {
    function readRowOpportunity(row) {
        if (!row) return null;

        const cells = row.querySelectorAll("td");

        return {
            symbol:
                row.dataset.symbol ||
                row.dataset.ticker ||
                cells[1]?.innerText?.trim() ||
                "UNKNOWN",

            timeframe:
                row.dataset.timeframe ||
                row.dataset.tf ||
                cells[2]?.innerText?.trim() ||
                "15m",

            score:
                Number(row.dataset.score || cells[3]?.innerText?.replace(/[^\d.]/g, "") || 0),

            grade:
                row.dataset.grade ||
                cells[4]?.innerText?.trim() ||
                "C",

            confidence:
                row.dataset.confidence ||
                cells[5]?.innerText?.trim() ||
                "Medium",

            expectedR:
                Number(row.dataset.expectedR || cells[6]?.innerText?.replace(/[^\d.]/g, "") || 0),

            source: "scanner-row-click"
        };
    }

    function bindScannerRows() {
        const body = document.getElementById("scannerResultsBody");
        if (!body || body.dataset.unifiedBound === "true") return;

        body.dataset.unifiedBound = "true";

        body.addEventListener("click", event => {
            const row = event.target.closest("tr");
            if (!row || row.querySelector(".empty-row")) return;

            const opportunity = readRowOpportunity(row);

            if (opportunity && opportunity.symbol !== "UNKNOWN") {
                window.UnifiedOpportunityStore?.set?.(opportunity, "scanner-row-click");
                window.EventBus?.publish?.("opportunity:selected", { opportunity });
                window.EventBus?.publish?.("scanner.result.selected", { opportunity });
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(bindScannerRows, 700);
        setInterval(bindScannerRows, 2000);
    });

    window.ScannerSelectionUnifier = {
        bindScannerRows,
        readRowOpportunity,
    };
})();