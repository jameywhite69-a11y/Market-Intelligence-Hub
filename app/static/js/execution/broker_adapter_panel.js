const brokerAdapterClient = new window.ExecutionApiClient();

async function renderBrokerAdapterPanel() {
    const panel = document.getElementById("brokerAdapterPanel");
    if (!panel) return;

    try {
        const adapters = await brokerAdapterClient.adapters();
        panel.innerHTML = `
            <section class="terminal-trade-card">
                <div class="terminal-card-header">
                    <h3>Execution Adapter</h3>
                    <span>${adapters.active}</span>
                </div>
                <select id="brokerAdapterSelect">
                    ${adapters.available.map(name => `
                        <option value="${name}" ${name === adapters.active ? "selected" : ""}>${name}</option>
                    `).join("")}
                </select>
                <p class="muted">Paper, backtest, and future live brokers now share one order contract.</p>
            </section>
        `;

        document.getElementById("brokerAdapterSelect")?.addEventListener("change", async event => {
            await brokerAdapterClient.setAdapter(event.target.value);
            document.dispatchEvent(new CustomEvent("paper-trade-updated"));
            await renderBrokerAdapterPanel();
        });
    } catch (error) {
        panel.innerHTML = `<p class="muted">Execution adapter unavailable: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", renderBrokerAdapterPanel);
document.addEventListener("paper-trade-updated", renderBrokerAdapterPanel);

window.BrokerAdapterPanel = {
    renderBrokerAdapterPanel,
};
