async function renderWorkstationExecutionRibbon() {
    const panel = document.getElementById("workstationExecutionRibbon");
    if (!panel || !window.ExecutionApiClient) return;

    try {
        const client = new window.ExecutionApiClient();
        const snapshot = await client.snapshot();

        panel.innerHTML = `
            <div><b>Equity</b><span>$${Number(snapshot.equity).toFixed(2)}</span></div>
            <div><b>Cash</b><span>$${Number(snapshot.cash).toFixed(2)}</span></div>
            <div><b>Open P&L</b><span>$${Number(snapshot.unrealized_pnl).toFixed(2)}</span></div>
            <div><b>Status</b><span>Paper</span></div>
        `;
    } catch {
        panel.innerHTML = `
            <div><b>Equity</b><span>—</span></div>
            <div><b>Cash</b><span>—</span></div>
            <div><b>Open P&L</b><span>—</span></div>
            <div><b>Status</b><span>Offline</span></div>
        `;
    }
}

document.addEventListener("paper-trade-updated", () => {
    renderWorkstationExecutionRibbon();
});

window.workstationBootstrap = {
    renderWorkstationExecutionRibbon,
};
