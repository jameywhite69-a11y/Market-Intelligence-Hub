class TechnicalApiClient {
    constructor(baseUrl = "/api/technical") {
        this.baseUrl = baseUrl;
    }

    async analyze(symbol, timeframe) {
        const url = `${this.baseUrl}/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}`;
        const response = await fetch(url);

        let payload = null;
        try {
            payload = await response.json();
        } catch {
            payload = null;
        }

        if (!response.ok) {
            throw new Error(payload?.detail || `Request failed with status ${response.status}`);
        }

        return payload;
    }
}

window.TechnicalApiClient = TechnicalApiClient;
