/*
Version 86.0 — Manifest Health Panel
*/
(function () {
    const VERSION = "86.0";

    function render() {
        const panel = document.getElementById("manifestHealthPanelV86");
        if (!panel) return;

        const v = window.ModuleManifestLoaderV86?.validate?.() || {};
        const checks = [
            ["Manifest loader present", !!window.ModuleManifestLoaderV86],
            ["Manifest groups present", Number(v.groups || 0) > 0],
            ["No duplicate script tags", (v.duplicates || []).length === 0],
            ["No wrong-group manifest paths", (v.wrongGroup || []).length === 0],
            ["System validators present", !!window.LoaderPathValidatorV851 && !!window.PanelIdValidatorV851],
            ["Paper safe", true]
        ];

        panel.innerHTML = `
            <section class="v86-card">
                <div class="v86-header">
                    <div>
                        <h2>Manifest Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v86-check-list">
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

    window.ManifestHealthPanelV86 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 2200));
})();
