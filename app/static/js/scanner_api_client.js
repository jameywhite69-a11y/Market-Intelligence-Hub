class ScannerApiClient {
    constructor(baseUrl = "/api/scanner") {
        this.baseUrl = baseUrl;
    }

    async createJob(scanRequest) {
        return this.request(`${this.baseUrl}/jobs`, {
            method: "POST",
            body: JSON.stringify(scanRequest),
        });
    }

    async runJob(jobId) {
        return this.request(`${this.baseUrl}/jobs/${jobId}/run`, {
            method: "POST",
        });
    }

    async getJob(jobId) {
        return this.request(`${this.baseUrl}/jobs/${jobId}`);
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
            const message = payload?.detail || `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        return payload;
    }
}

window.ScannerApiClient = ScannerApiClient;