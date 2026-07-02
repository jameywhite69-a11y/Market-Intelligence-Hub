/*
Version 57.0 — Live Opportunity Timeline
Shows recent institutional decision changes.
*/
(function () {
    const VERSION = "57.0";
    const EVENTS = [];

    function add(model) {
        if (!model) return;
        EVENTS.unshift({
            time: new Date().toLocaleTimeString(),
            symbol: model.symbol,
            decision: model.decision,
            score: model.score,
            readiness: model.readiness
        });
        while (EVENTS.length > 12) EVENTS.pop();
        render();
    }

    function render() {
        const panel = document.getElementById("opportunityTimelineV57Panel");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v57-timeline-card">
                <div class="v57-header">
                    <div>
                        <h2>Opportunity Timeline</h2>
                        <span>${EVENTS.length} recent events</span>
                    </div>
                    <strong>LIVE</strong>
                </div>
                <div class="v57-timeline-list">
                    ${EVENTS.map(e => `
                        <div class="v57-timeline-row">
                            <b>${e.time}</b>
                            <span>${e.symbol}</span>
                            <em>${e.decision}</em>
                            <strong>${e.score}</strong>
                        </div>
                    `).join("") || "<div class='v57-empty'>Awaiting decisions</div>"}
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("institutional-decision.updated", add);
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1500));

    window.OpportunityTimelineV57 = { render, add, version: VERSION };
})();
