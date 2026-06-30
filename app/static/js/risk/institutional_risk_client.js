class InstitutionalRiskClient {
    async assess(context) {
        const response = await fetch("/api/risk/assess", {
            method: "POST",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({ context }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        return payload;
    }
}

window.InstitutionalRiskClient = InstitutionalRiskClient;
window.institutionalRiskClient = new InstitutionalRiskClient();
