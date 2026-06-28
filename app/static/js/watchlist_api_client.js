class WatchlistApiClient {
    constructor(baseUrl = "/api/watchlists") {
        this.baseUrl = baseUrl;
    }

    async list() {
        return this.request(this.baseUrl);
    }

    async seed() {
        return this.request(`${this.baseUrl}/seed`, { method: "POST" });
    }

    async create(watchlist) {
        return this.request(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(watchlist),
        });
    }

    async remove(name) {
        return this.request(`${this.baseUrl}/${encodeURIComponent(name)}`, {
            method: "DELETE",
        });
    }

    async addSymbol(name, symbol) {
        return this.request(`${this.baseUrl}/${encodeURIComponent(name)}/symbols`, {
            method: "POST",
            body: JSON.stringify({ symbol }),
        });
    }

    async removeSymbol(name, symbol) {
        return this.request(
            `${this.baseUrl}/${encodeURIComponent(name)}/symbols/${encodeURIComponent(symbol)}`,
            { method: "DELETE" }
        );
    }

    async request(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...options,
        });

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

window.WatchlistApiClient = WatchlistApiClient;
