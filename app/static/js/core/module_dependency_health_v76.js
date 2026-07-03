/*
Version 76.0 — Module Dependency Health
*/
(function () {
    const VERSION = "76.0";

    function check() {
        const snap = window.ModuleRegistryV76?.snapshot?.() || { modules: [] };
        const rows = snap.modules.map(m => ({
            label: m.label,
            ok: m.status === "ready",
            status: m.status,
            error: m.lastError
        }));

        return {
            rows,
            passed: rows.filter(r => r.ok).length,
            total: rows.length
        };
    }

    function render() {
        const panel = document.getElementById("moduleDependencyHealthPanelV76");
        if (!panel) return;

        const c = check();

        panel.innerHTML = `
            <section class="v76-card">
                <div class="v76-header">
                    <div>
                        <h2>Module Dependency Health</h2>
                        <span>${c.passed}/${c.total} modules ready</span>
                    </div>
                    <strong>${c.passed === c.total ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v76-check-list">
                    ${c.rows.map(row => `
                        <div class="${row.ok ? "pass" : "fail"}">
                            <b>${row.ok ? "✓" : "!"}</b>
                            <span>${row.label}</span>
                            <em>${row.status}</em>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("module-registry-v76.updated", render);
        setTimeout(render, 2000);
    }

    window.ModuleDependencyHealthV76 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1500));
})();
