class StrategyExecutionClient {
    async strategies() {
        return await this._request("/api/strategy-execution/strategies");
    }

    async plan(opportunity) {
        return await this._request("/api/strategy-execution/plan", {
            method: "POST",
            body: JSON.stringify({opportunity}),
        });
    }

    async execute(plan) {
        return await this._request("/api/strategy-execution/execute", {
            method: "POST",
            body: JSON.stringify({plan}),
        });
    }

    async _request(path, options = {}) {
        const response = await fetch(path, {
            headers: {
                "Accept": "application/json",
                ...(options.body ? {"Content-Type": "application/json"} : {}),
                ...(options.headers || {}),
            },
            ...options,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        return payload;
    }
}

window.StrategyExecutionClient = StrategyExecutionClient;
window.strategyExecutionClient = new StrategyExecutionClient();
