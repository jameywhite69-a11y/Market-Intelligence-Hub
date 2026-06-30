class TradeLifecycleClient {
    async snapshot() {
        return await this._request("/api/trade-lifecycle/snapshot");
    }

    async opportunity(opportunity, source = "workspace") {
        return await this._request("/api/trade-lifecycle/opportunity", {
            method: "POST",
            body: JSON.stringify({ opportunity, source }),
        });
    }

    async entered(symbol, timeframe = "15m", source = "execution") {
        return await this._request("/api/trade-lifecycle/entered", {
            method: "POST",
            body: JSON.stringify({ symbol, timeframe, source }),
        });
    }

    async closed(symbol, timeframe = "15m", source = "execution") {
        return await this._request("/api/trade-lifecycle/closed", {
            method: "POST",
            body: JSON.stringify({ symbol, timeframe, source }),
        });
    }

    async reset() {
        return await this._request("/api/trade-lifecycle/reset", {
            method: "POST",
            body: JSON.stringify({}),
        });
    }

    async _request(path, options = {}) {
        const response = await fetch(path, {
            headers: {
                "Accept": "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(options.headers || {}),
            },
            ...options,
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        return payload;
    }
}

window.TradeLifecycleClient = TradeLifecycleClient;
window.tradeLifecycleClient = new TradeLifecycleClient();
