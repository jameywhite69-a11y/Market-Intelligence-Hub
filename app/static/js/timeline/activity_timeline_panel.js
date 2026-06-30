(function () {
    function renderActivityTimelinePanel() {
        const panel = document.getElementById("activityTimelinePanel");
        if (!panel) return;

        const rows = window.ActivityTimelineStore?.list?.(40) || [];

        panel.innerHTML = `
            <section class="activity-timeline-card">
                <div class="terminal-card-header">
                    <h3>Activity Timeline</h3>
                    <span>${rows.length} recent</span>
                </div>

                <div class="activity-timeline-actions">
                    <button id="clearActivityTimelineButton" class="secondary-button">Clear</button>
                </div>

                <div class="activity-timeline-list">
                    ${rows.map(row => `
                        <div class="activity-timeline-row ${row.severity}">
                            <div class="timeline-time">${new Date(row.timestamp).toLocaleTimeString()}</div>
                            <div class="timeline-content">
                                <b>${row.title}</b>
                                <span>${row.detail || "Recorded"}</span>
                                ${row.symbol ? `<small>${row.symbol}${row.timeframe ? ` · ${row.timeframe}` : ""}</small>` : ""}
                            </div>
                        </div>
                    `).join("") || `<p class="muted">No activity recorded yet.</p>`}
                </div>
            </section>
        `;

        document.getElementById("clearActivityTimelineButton")?.addEventListener("click", () => {
            window.ActivityTimelineStore?.clear?.();
            renderActivityTimelinePanel();
        });
    }

    window.EventBus?.subscribe?.("activity.timeline.updated", renderActivityTimelinePanel);
    window.EventBus?.subscribe?.("activity.timeline.cleared", renderActivityTimelinePanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderActivityTimelinePanel, 300));

    window.ActivityTimelinePanel = { renderActivityTimelinePanel };
})();
