function setStatus(message) {
    const status = scannerDom.status || document.getElementById("scanStatus");
    if (status) {
        status.textContent = message;
    }
}

function setLastScanLabel(message) {
    const label = scannerDom.lastScanLabel || document.getElementById("lastScanLabel");
    if (label) {
        label.textContent = message;
    }
}

function setCountdown(message) {
    const label = scannerDom.countdownLabel || document.getElementById("countdownLabel");
    if (label) {
        label.textContent = message;
    }
}

window.scannerStatus = {
    setStatus,
    setLastScanLabel,
    setCountdown,
};
