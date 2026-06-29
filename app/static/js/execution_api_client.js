class ExecutionApiClient {
    async adapters() {
        return await this._request("/api/execution/adapters");
    }

    async setAdapter(adapter) {
        return await this._request("/api/execution/adapter", {
            method: "POST",
            body: JSON.stringify({adapter}),
        });
    }

    async snapshot() {
        return await this._request("/api/execution/snapshot");
    }

    async reset() {
        return await this._request("/api/execution/reset", {
            method: "POST",
            body: JSON.stringify({}),
        });
    }

    async submitOrder(order) {
        return await this._request("/api/execution/orders", {
            method: "POST",
            body: JSON.stringify(this.normalizeOrder(order)),
        });
    }

    normalizeOrder(order) {
        const entry = Number(order.entry_price ?? order.entry ?? order.requested_price ?? 199);
        const stop = Number(order.stop_loss ?? order.stop ?? 0);
        const target = Number(order.take_profit ?? order.target ?? 0);

        return {
            symbol: String(order.symbol || "").toUpperCase(),
            timeframe: order.timeframe || "15m",
            side: String(order.side || "buy").toLowerCase(),
            quantity: Number(order.quantity ?? order.qty ?? 0),
            order_type: String(order.order_type || order.orderType || "market").toLowerCase(),
            entry_price: Number.isFinite(entry) ? entry : null,
            stop_loss: Number.isFinite(stop) && stop > 0 ? stop : null,
            take_profit: Number.isFinite(target) && target > 0 ? target : null,
            confidence: order.confidence || null,
            expected_r: Number(order.expected_r ?? order.expectedR ?? 0),
            allocation: Number(order.allocation ?? 0),
            source: order.source || "paper",
        };
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

        if (!response.ok) {
            const message = payload.detail || payload.reason || `${response.status} ${response.statusText}`;
            throw new Error(Array.isArray(message) ? JSON.stringify(message) : message);
        }

        return payload;
    }
}

window.ExecutionApiClient = ExecutionApiClient;
