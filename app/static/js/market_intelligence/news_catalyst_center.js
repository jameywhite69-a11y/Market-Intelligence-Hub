/*
Version 43.3 — News & Catalyst Intelligence Center

Frontend scaffold for market catalysts, economic events, symbol news context,
and AI-style catalyst summaries. Uses local/demo data now; future releases can
connect to live news/economic APIs.
*/
(function () {
    const STORAGE_KEY = "mih.news.catalysts.v43";

    const defaultCatalysts = [
        {
            id: "market-regime",
            category: "Market Regime",
            title: "Risk environment monitoring",
            impact: "Medium",
            symbol: "MARKET",
            summary: "Monitor index direction, volatility, rates, and breadth before adding exposure.",
            timestamp: new Date().toISOString(),
        },
        {
            id: "crypto-liquidity",
            category: "Crypto",
            title: "Liquidity and correlation check",
            impact: "Medium",
            symbol: "BTC",
            summary: "Crypto opportunities should be reviewed against total crypto exposure and correlation.",
            timestamp: new Date().toISOString(),
        },
        {
            id: "economic-calendar",
            category: "Economic Calendar",
            title: "Scheduled macro events",
            impact: "High",
            symbol: "MARKET",
            summary: "Avoid new trades immediately before major CPI, FOMC, jobs, or rate-decision events.",
            timestamp: new Date().toISOString(),
        },
    ];

    function loadCatalysts() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return saved.length ? saved : defaultCatalysts;
        } catch {
            return defaultCatalysts;
        }
    }

    function saveCatalysts(catalysts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(catalysts));
    }

    function selectedSymbol() {
        return window.WorkspaceContext?.snapshot?.()?.symbol ||
               window.OpportunityStore?.getSelectedOpportunity?.()?.symbol ||
               "MARKET";
    }

    function catalystScore(catalysts) {
        const weights = { High: 3, Medium: 2, Low: 1 };
        return catalysts.reduce((sum, item) => sum + (weights[item.impact] || 1), 0);
    }

    function generateCatalystSummary(catalysts, symbol) {
        if (!catalysts.length) {
            return `No active catalysts are currently associated with ${symbol}. Continue monitoring market regime and scanner quality.`;
        }

        const highImpact = catalysts.filter(item => item.impact === "High").length;
        const mediumImpact = catalysts.filter(item => item.impact === "Medium").length;

        if (highImpact) {
            return `${symbol} has high-impact catalyst risk. Require stronger confirmation and consider reduced position size.`;
        }

        if (mediumImpact) {
            return `${symbol} has moderate catalyst context. Continue with standard AI, risk, and portfolio checks before execution.`;
        }

        return `${symbol} has low catalyst pressure. Technical and risk workflow can remain primary.`;
    }

    function renderNewsCatalystCenter() {
        const panel = document.getElementById("newsCatalystCenterPanel");
        if (!panel) return;

        const symbol = selectedSymbol();
        const all = loadCatalysts();
        const catalysts = all.filter(item => item.symbol === "MARKET" || item.symbol === symbol);
        const score = catalystScore(catalysts);
        const summary = generateCatalystSummary(catalysts, symbol);

        panel.innerHTML = `
            <section class="news-catalyst-card">
                <div class="terminal-card-header">
                    <h3>News & Catalyst Intelligence</h3>
                    <span>${symbol}</span>
                </div>

                <div class="catalyst-hero">
                    <div>
                        <b>Catalyst Score</b>
                        <span>${score}</span>
                    </div>
                    <strong>${score >= 6 ? "Elevated" : score >= 3 ? "Moderate" : "Low"}</strong>
                </div>

                <p class="catalyst-summary">${summary}</p>

                <div class="catalyst-list">
                    ${catalysts.map(item => `
                        <div class="catalyst-row ${String(item.impact).toLowerCase()}">
                            <div>
                                <b>${item.title}</b>
                                <span>${item.category} · ${item.impact}</span>
                                <small>${item.summary}</small>
                            </div>
                        </div>
                    `).join("") || `<p class="muted">No catalysts available.</p>`}
                </div>

                <div class="catalyst-actions">
                    <button id="addDemoCatalystButton" class="secondary-button">Add Demo Catalyst</button>
                    <button id="resetCatalystsButton" class="secondary-button">Reset</button>
                </div>
            </section>
        `;

        document.getElementById("addDemoCatalystButton")?.addEventListener("click", () => {
            const updated = loadCatalysts();
            updated.unshift({
                id: `manual-${Date.now()}`,
                category: "Manual Catalyst",
                title: `${symbol} catalyst note`,
                impact: "Medium",
                symbol,
                summary: "Manual catalyst placeholder added for workflow testing.",
                timestamp: new Date().toISOString(),
            });
            saveCatalysts(updated);
            renderNewsCatalystCenter();
            window.EventBus?.publish?.("market-intelligence.catalyst-added", { symbol });
        });

        document.getElementById("resetCatalystsButton")?.addEventListener("click", () => {
            saveCatalysts(defaultCatalysts);
            renderNewsCatalystCenter();
        });
    }

    window.EventBus?.subscribe?.("workspace.context.changed", renderNewsCatalystCenter);
    window.EventBus?.subscribe?.("opportunity:selected", renderNewsCatalystCenter);
    window.EventBus?.subscribe?.("command-center.updated", renderNewsCatalystCenter);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderNewsCatalystCenter, 700));

    window.NewsCatalystCenter = {
        renderNewsCatalystCenter,
        loadCatalysts,
        saveCatalysts,
    };
})();
