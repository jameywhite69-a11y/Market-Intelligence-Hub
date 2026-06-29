(function () {
    async function request(path, options = {}) {
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
            const message = payload.detail || payload.reason || payload.message || `${response.status} ${response.statusText}`;
            throw new Error(Array.isArray(message) ? JSON.stringify(message) : message);
        }

        return payload;
    }

    window.ApiClient = {
        request,
        scanner: {
            createJob: payload => request("/api/scanner/jobs", {method: "POST", body: JSON.stringify(payload)}),
            runJob: jobId => request(`/api/scanner/jobs/${jobId}/run`, {method: "POST", body: JSON.stringify({})}),
            getJob: jobId => request(`/api/scanner/jobs/${jobId}`),
        },
        technical: {
            analyze: (symbol, timeframe) => request(`/api/technical/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}`),
        },
        execution: {
            snapshot: () => request("/api/execution/snapshot"),
            reset: () => request("/api/execution/reset", {method: "POST", body: JSON.stringify({})}),
            submitOrder: payload => request("/api/execution/orders", {method: "POST", body: JSON.stringify(payload)}),
        },
        watchlists: {
            list: () => request("/api/watchlists"),
            seed: () => request("/api/watchlists/seed", {method: "POST", body: JSON.stringify({})}),
        },
    };
})();
