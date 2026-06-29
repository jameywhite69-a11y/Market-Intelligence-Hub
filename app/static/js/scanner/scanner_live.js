function resetCountdown() {
    scannerState.countdownSeconds = scannerState.refreshIntervalSeconds;
    updateCountdownLabel();
}

function updateCountdownLabel() {
    if (!scannerDom.countdownLabel) return;

    scannerDom.countdownLabel.textContent = scannerState.liveMode
        ? `Next scan in ${scannerState.countdownSeconds}s`
        : "Live scanning paused";
}

function startLiveMode() {
    scannerState.liveMode = true;
    scannerState.refreshIntervalSeconds = Number(scannerDom.refreshIntervalSelect?.value || 30);
    resetCountdown();

    clearInterval(scannerState.refreshTimerId);
    clearInterval(scannerState.countdownTimerId);

    scannerState.countdownTimerId = setInterval(() => {
        scannerState.countdownSeconds = Math.max(0, scannerState.countdownSeconds - 1);
        updateCountdownLabel();
    }, 1000);

    scannerState.refreshTimerId = setInterval(() => {
        scannerOrchestrator.runScanner({ automatic: true });
    }, scannerState.refreshIntervalSeconds * 1000);

    scannerDom.liveModeButton.disabled = true;
    scannerDom.pauseLiveButton.disabled = false;
    scannerStatus.setStatus("Live scanning started.", "success");
}

function stopLiveMode() {
    scannerState.liveMode = false;

    clearInterval(scannerState.refreshTimerId);
    clearInterval(scannerState.countdownTimerId);

    scannerState.refreshTimerId = null;
    scannerState.countdownTimerId = null;

    if (scannerDom.liveModeButton) scannerDom.liveModeButton.disabled = false;
    if (scannerDom.pauseLiveButton) scannerDom.pauseLiveButton.disabled = true;

    updateCountdownLabel();
}

function bindLiveControls() {
    scannerDom.liveModeButton?.addEventListener("click", startLiveMode);
    scannerDom.pauseLiveButton?.addEventListener("click", stopLiveMode);

    scannerDom.refreshIntervalSelect?.addEventListener("change", () => {
        scannerState.refreshIntervalSeconds = Number(scannerDom.refreshIntervalSelect.value || 30);
        resetCountdown();

        if (scannerState.liveMode) {
            stopLiveMode();
            startLiveMode();
        }
    });
}

window.scannerLive = {
    bindLiveControls,
    resetCountdown,
    startLiveMode,
    stopLiveMode,
};
