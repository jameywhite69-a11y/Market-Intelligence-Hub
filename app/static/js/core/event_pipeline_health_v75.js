/*
Version 75.0 — Event Pipeline Health
*/
(function () {
    const VERSION = "75.0";

    function check() {
        const snap = window.CoreEventDispatcherV75?.snapshot?.() || {};
        return [
            ["Dispatcher Loaded", !!window.CoreEventDispatcherV75],
            ["EventBus Present", !!window.EventBus],
            ["State Available", !!snap.state],
            ["Realtime Bridge", "realtime" in (snap.state || {})],
            ["Execution Bridge", "execution" in (snap.state || {})],
            ["Recent Events", (snap.eventLog || []).length >= 0]
        ];
    }

    function render() {
        const panel = document.getElementById("eventPipelineHealthPanelV75");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v75-card">
                <div class="v75-header">
                    <div>
                        <h2>Event Pipeline Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v75-check-list">
                    ${checks.map(([label, ok]) => `
                        <div class="${ok ? "pass" : "fail"}">
                            <b>${ok ? "✓" : "!"}</b>
                            <span>${label}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("core-dispatcher.updated", render);
        setTimeout(render, 1800);
    }

    window.EventPipelineHealthV75 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
