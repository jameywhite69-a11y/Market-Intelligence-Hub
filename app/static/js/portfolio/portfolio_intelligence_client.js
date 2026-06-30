class PortfolioIntelligenceClient {
    async snapshot() {
        const response = await fetch("/api/portfolio-intelligence/snapshot", {
            headers: { "Accept": "application/json" },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        }

        return payload;
    }
}

window.PortfolioIntelligenceClient = PortfolioIntelligenceClient;
window.portfolioIntelligenceClient = new PortfolioIntelligenceClient();
