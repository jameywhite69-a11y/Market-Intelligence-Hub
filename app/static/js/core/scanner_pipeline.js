(function () {
    function buildRequest() {
        const symbols = scannerUtils.parseCsv(DOMRegistry.value("symbolsInput", ""));
        const timeframes = scannerUtils.parseCsv(DOMRegistry.value("timeframesInput", ""));
        const indicators = scannerUtils.parseCsv(DOMRegistry.value("indicatorsInput", ""))
            .map(indicator => indicator.toUpperCase());

        const parameters = {};
        for (const indicator of indicators) parameters[indicator] = { length: 20 };
        return { symbols, timeframes, indicators, parameters };
    }

    function validate(request) {
        if (!request.symbols.length) throw new Error("Enter at least one symbol.");
        if (!request.timeframes.length) throw new Error("Enter at least one timeframe.");
        if (!request.indicators.length) throw new Error("Enter at least one indicator.");
    }

    function setLoading(isLoading) {
        scannerState.isRunning = isLoading;
        scannerStatus.setLoading(isLoading);
    }

    async function run({ automatic = false } = {}) {
        if (scannerState.isRunning) return;

        setLoading(true);
        scannerStatus.setStatus(automatic ? "Auto-refresh scan running..." : "Creating scan job...");
        DOMRegistry.setHtml("scannerResultsBody", `<tr><td colspan="12" class="empty-row">Scanning...</td></tr>`);
        DOMRegistry.setText("resultCount", "Scanning...");
        EventBus?.publish("scan:started", { automatic });

        try {
            const request = buildRequest();
            validate(request);

            const job = await ApiClient.scanner.createJob(request);
            scannerState.currentJobId = job.job_id;
            EventBus?.publish("scan:job-created", job);

            scannerStatus.setStatus("Running indicators and ranking results...");
            const started = performance.now();
            const completed = await ApiClient.scanner.runJob(job.job_id);
            const elapsed = Math.round(performance.now() - started);

            scannerState.previousResults = scannerState.results || [];
            scannerState.results = completed.results || [];
            scannerState.filteredResults = completed.results || [];
            scannerState.diagnostics = completed.diagnostics || null;
            scannerState.selectedKey = null;

            scannerState.scanHistory.push({
                time: new Date().toLocaleTimeString(),
                count: scannerState.results.length,
                ms: elapsed,
            });

            WorkspaceStore?.set?.("scannerResults", scannerState.results);
            WorkspaceStore?.set?.("filteredResults", scannerState.filteredResults);
            WorkspaceStore?.set?.("diagnostics", scannerState.diagnostics);
            WorkspaceStore?.set?.("lastScan", { jobId: completed.job_id, elapsed, time: new Date().toISOString() });

            DOMRegistry.setText("lastScanLabel", new Date().toLocaleTimeString());

            EventBus?.publish("scan:completed", {
                job: completed,
                results: scannerState.results,
                diagnostics: scannerState.diagnostics,
                elapsed,
            });

            scannerStatus.setStatus(`Completed job ${completed.job_id}`);
        } catch (error) {
            console.error(error);
            WorkspaceStore?.pushError?.(error, "scanner-pipeline");
            EventBus?.publish("scan:failed", { error });
            scannerStatus.setStatus("Error running scan.");
            window.scannerLive?.stopLiveMode?.();
        } finally {
            setLoading(false);
            window.scannerLive?.resetCountdown?.();
        }
    }

    window.ScannerPipeline = { run, buildRequest, validate };
})();
