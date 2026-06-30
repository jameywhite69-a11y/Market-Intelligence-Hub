class AIDecisionClient {
    async analyze(context) {
        const response = await fetch("/api/ai-decision/analyze", {
            method: "POST",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({ context }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
        return payload;
    }
}
window.AIDecisionClient = AIDecisionClient;
window.aiDecisionClient = new AIDecisionClient();
