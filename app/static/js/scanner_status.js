function setStatus(message) {
    DOMRegistry?.setText?.("scanStatus", message ?? "");
}

function setLastScanLabel(message) {
    DOMRegistry?.setText?.("lastScanLabel", message ?? "");
}

function setCountdown(message) {
    DOMRegistry?.setText?.("countdownLabel", message ?? "");
}

function setLoading(isLoading) {
    const button = DOMRegistry?.get?.("runScanButton");
    if (button) {
        button.disabled = Boolean(isLoading);
        button.textContent = isLoading ? "Scanning..." : "Run Scan";
    }
}

window.scannerStatus = {
    setStatus,
    setLastScanLabel,
    setCountdown,
    setLoading,
    setScanStatus: setStatus,
    setScannerStatus: setStatus,
    setReady: () => setStatus("Ready"),
    setScanning: () => setStatus("Scanning..."),
    setRunning: () => setStatus("Running..."),
    setLoadingStatus: () => setStatus("Loading..."),
    setCompleted: () => setStatus("Completed"),
    setComplete: () => setStatus("Completed"),
    setError: () => setStatus("Error"),
    setPaused: () => setStatus("Paused"),
};
