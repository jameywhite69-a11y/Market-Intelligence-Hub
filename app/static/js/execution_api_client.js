class ExecutionApiClient {
    async snapshot() {
        const response = await fetch("/api/execution/snapshot");
        if (!response.ok) throw new Error("Execution snapshot unavailable");
        return await response.json();
    }

    async submitOrder(order) {
        const response = await fetch("/api/execution/orders", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(order),
        });
        if (!response.ok) throw new Error("Order rejected");
        return await response.json();
    }

    async reset() {
        const response = await fetch("/api/execution/reset", {method: "POST"});
        if (!response.ok) throw new Error("Reset failed");
        return await response.json();
    }
}

window.ExecutionApiClient = ExecutionApiClient;
