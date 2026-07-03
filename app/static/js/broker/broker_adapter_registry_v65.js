/*
Version 65.0 — Broker Adapter Registry
Maintains broker capabilities and readiness.
Paper is enabled. Live brokers are placeholders only.
*/
(function () {
    const VERSION = "65.0";

    const ADAPTERS = [
        {
            id: "paper",
            name: "Paper Broker",
            status: "enabled",
            live: false,
            supports: ["market", "limit", "bracket", "cancel"]
        },
        {
            id: "tradestation",
            name: "TradeStation",
            status: "not_configured",
            live: true,
            supports: ["market", "limit", "bracket"]
        },
        {
            id: "interactive_brokers",
            name: "Interactive Brokers",
            status: "not_configured",
            live: true,
            supports: ["market", "limit", "bracket", "options"]
        },
        {
            id: "coinbase_advanced",
            name: "Coinbase Advanced",
            status: "not_configured",
            live: true,
            supports: ["market", "limit", "crypto"]
        },
        {
            id: "alpaca",
            name: "Alpaca",
            status: "not_configured",
            live: true,
            supports: ["market", "limit", "equities"]
        }
    ];

    function list() {
        return ADAPTERS.slice();
    }

    function render() {
        const panel = document.getElementById("brokerAdapterRegistryPanelV65");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v65-card">
                <div class="v65-header">
                    <div>
                        <h2>Broker Adapter Registry</h2>
                        <span>available execution adapters</span>
                    </div>
                    <strong>${ADAPTERS.length}</strong>
                </div>

                <div class="v65-adapter-list">
                    ${ADAPTERS.map(a => `
                        <div class="${a.status}">
                            <b>${a.name}</b>
                            <span>${a.status.replace("_", " ")}</span>
                            <em>${a.live ? "LIVE CAPABLE" : "PAPER"}</em>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    window.BrokerAdapterRegistryV65 = { list, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1500));
})();
