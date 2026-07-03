/*
Version 61.0 — Relative Strength Rankings
Ranks symbols across scanner candidates by relative strength, momentum, and liquidity.
*/
(function () {
    const VERSION = "61.0";

    function build(list) {
        list = list || window.TIOSInstitutionalScannerV56?.latest || [];
        return list
            .map(x => ({
                symbol: x.symbol,
                score: Number(x.score || 0),
                relativeStrength: Number(x.relativeStrength || x.rs || x.score || 0),
                momentum: Number(x.momentum || 0),
                liquidity: Number(x.liquidity || 0),
                composite: Number(((Number(x.relativeStrength || x.score || 0) * 0.45) + (Number(x.momentum || 0) * 0.35) + (Number(x.liquidity || 0) * 0.20)).toFixed(1))
            }))
            .sort((a, b) => b.composite - a.composite);
    }

    function render(list = build()) {
        const panel = document.getElementById("relativeStrengthRankingsPanel");
        if (!panel) return;

        const rows = list.slice(0, 10);
        panel.innerHTML = `
            <section class="v61-rs-card">
                <div class="v61-header">
                    <div>
                        <h2>Relative Strength Rankings</h2>
                        <span>momentum · liquidity · leadership</span>
                    </div>
                    <strong>${rows[0]?.symbol || "—"}</strong>
                </div>

                <div class="v61-rs-list">
                    ${rows.map((row, i) => `
                        <button data-symbol="${row.symbol}">
                            <b>#${i + 1} ${row.symbol}</b>
                            <i><em style="width:${Math.max(0, Math.min(100, row.composite))}%"></em></i>
                            <span>${row.composite.toFixed(1)}</span>
                        </button>
                    `).join("") || "<div class='v61-empty'>Run scan to rank symbols</div>"}
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-symbol]").forEach(btn => {
            btn.addEventListener("click", () => {
                const full = (window.TIOSInstitutionalScannerV56?.latest || []).find(x => x.symbol === btn.dataset.symbol);
                if (full) {
                    window.EventBus?.publish?.("scanner.selection.changed", full);
                    window.EventBus?.publish?.("unified-opportunity.changed", { key: "v61-rs", value: full });
                }
            });
        });
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => render(build(payload?.results || [])));
        setTimeout(() => render(), 1600);
    }

    window.RelativeStrengthRankingsV61 = { build, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1100));
})();
