class LiveMarketDataClient {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectTimer = null;
    }

    async snapshot(symbols = ["BTC", "ETH", "SOL"]) {
        const query = encodeURIComponent(symbols.join(","));
        const response = await fetch(`/api/market-data/snapshot?symbols=${query}`, {
            headers: {"Accept": "application/json"},
        });

        if (!response.ok) {
            throw new Error(`Market data snapshot failed: ${response.status}`);
        }

        return await response.json();
    }

    connect(symbols = ["BTC", "ETH", "SOL"], interval = 2) {
        this.disconnect();

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const url = `${protocol}://${window.location.host}/api/market-data/stream`;

        this.socket = new WebSocket(url);

        this.socket.addEventListener("open", () => {
            this.isConnected = true;
            this.socket.send(JSON.stringify({symbols, interval}));
            window.EventBus?.publish?.("market-data:connected", {symbols});
        });

        this.socket.addEventListener("message", event => {
            const snapshot = JSON.parse(event.data);
            window.WorkspaceStore?.set?.("marketDataSnapshot", snapshot);
            window.EventBus?.publish?.("market-data:tick", snapshot);
        });

        this.socket.addEventListener("close", () => {
            this.isConnected = false;
            window.EventBus?.publish?.("market-data:disconnected", {});
        });

        this.socket.addEventListener("error", error => {
            this.isConnected = false;
            window.EventBus?.publish?.("market-data:error", {error});
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnected = false;
    }
}

window.LiveMarketDataClient = LiveMarketDataClient;
window.liveMarketDataClient = new LiveMarketDataClient();
