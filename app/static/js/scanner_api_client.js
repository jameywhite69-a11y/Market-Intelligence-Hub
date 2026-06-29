class ScannerApiClient {
    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
    }

    async createJob(request) {
        return await this._post("/api/scanner/jobs", request);
    }

    async runJob(jobId) {
        return await this._post(`/api/scanner/jobs/${jobId}/run`, {});
    }

    async getJob(jobId) {
        return await this._get(`/api/scanner/jobs/${jobId}`);
    }

    async _get(path) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "GET",
            headers: {"Accept": "application/json"},
        });

        return await this._handleResponse(response, path);
    }

    async _post(path, body) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body || {}),
        });

        return await this._handleResponse(response, path);
    }

    async _handleResponse(response, path) {
        if (!response.ok) {
            let message = `${response.status} ${response.statusText}`;

            try {
                const payload = await response.json();
                message = payload.detail || message;
            } catch {
                // Keep original HTTP message.
            }

            throw new Error(`Scanner API failed at ${path}: ${message}`);
        }

        return await response.json();
    }
}

window.ScannerApiClient = ScannerApiClient;
