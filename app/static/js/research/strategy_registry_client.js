class StrategyRegistryClient {
    async list() { return await this._request("/api/research/strategies"); }
    async health() { return await this._request("/api/research/strategies/health"); }
    async get(strategyId) { return await this._request(`/api/research/strategies/${strategyId}`); }
    async _request(path) {
        const response = await fetch(path, {headers: {"Accept": "application/json"}});
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        return payload;
    }
}
window.StrategyRegistryClient = StrategyRegistryClient;
window.strategyRegistryClient = new StrategyRegistryClient();
