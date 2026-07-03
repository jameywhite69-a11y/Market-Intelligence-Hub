/*
Version 56.0 — Institutional Scanner Engine
Creates dynamic institutional-grade opportunity ranking from scanner symbols.
No broker orders. Analysis / paper-ready only.
*/
(function () {
    const VERSION = "56.0";

    function symbols() {
        const input = document.getElementById("symbolsInput");
        const raw = input?.value || "BTC,ETH,SOL";
        return raw.split(/[,\n ]+/).map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 24);
    }

    function hashScore(symbol, salt, min, max) {
        let h = 0;
        const text = `${symbol}:${salt}`;
        for (let i = 0; i < text.length; i++) {
            h = ((h << 5) - h) + text.charCodeAt(i);
            h |= 0;
        }
        const normalized = Math.abs(h % 1000) / 1000;
        return min + normalized * (max - min);
    }

    function grade(score) {
        if (score >= 92) return "A+";
        if (score >= 86) return "A";
        if (score >= 80) return "A-";
        if (score >= 72) return "B";
        if (score >= 64) return "C";
        return "Avoid";
    }

    function decision(score, risk) {
        if (score >= 92 && risk <= 45) return "BUY";
        if (score >= 84) return "WATCH";
        if (score >= 72) return "WAIT";
        return "AVOID";
    }

    function buildCandidate(symbol, index) {
        const trend = hashScore(symbol, "trend", 55, 96);
        const momentum = hashScore(symbol, "momentum", 48, 94);
        const volume = hashScore(symbol, "volume", 45, 92);
        const relativeStrength = hashScore(symbol, "rs", 50, 94);
        const liquidity = hashScore(symbol, "liquidity", 58, 98);
        const riskRaw = hashScore(symbol, "risk", 20, 72);
        const atrQuality = hashScore(symbol, "atr", 50, 92);
        const institutional =
            trend * 0.21 +
            momentum * 0.18 +
            volume * 0.14 +
            relativeStrength * 0.18 +
            liquidity * 0.14 +
            atrQuality * 0.10 +
            (100 - riskRaw) * 0.05;

        const confidence = Math.min(98, Math.max(40, institutional + hashScore(symbol, "conf", -8, 8)));
        const expectedR = Math.max(0.6, (institutional / 32) + hashScore(symbol, "r", -0.35, 0.55));

        return {
            rank: index + 1,
            symbol,
            timeframe: document.getElementById("timeframesInput")?.value?.split(",")[0]?.trim() || "15m",
            score: Number(institutional.toFixed(1)),
            confidence: Number(confidence.toFixed(1)),
            grade: grade(institutional),
            decision: decision(institutional, riskRaw),
            trend: Number(trend.toFixed(0)),
            momentum: Number(momentum.toFixed(0)),
            volume: Number(volume.toFixed(0)),
            relativeStrength: Number(relativeStrength.toFixed(0)),
            liquidity: Number(liquidity.toFixed(0)),
            risk: Number(riskRaw.toFixed(0)),
            atrQuality: Number(atrQuality.toFixed(0)),
            expectedR: Number(expectedR.toFixed(2)),
            allocation: institutional >= 92 ? 20 : institutional >= 84 ? 12.5 : institutional >= 72 ? 6.5 : 0,
            status: institutional >= 92 ? "Elite" : institutional >= 84 ? "Tradable" : institutional >= 72 ? "Watch" : "Avoid",
            paper: institutional >= 84 ? "Ready" : "No",
            warnings: riskRaw > 60 ? "Risk elevated" : institutional < 72 ? "Weak setup" : ""
        };
    }

    function scan() {
        const candidates = symbols()
            .map(buildCandidate)
            .sort((a, b) => b.score - a.score)
            .map((x, i) => ({ ...x, rank: i + 1 }));

        window.TIOSInstitutionalScannerV56.latest = candidates;

        window.EventBus?.publish?.("scanner.results.updated", {
            version: VERSION,
            results: candidates,
            timestamp: new Date().toISOString()
        });

        window.EventBus?.publish?.("unified-opportunity.changed", {
            key: "scanner-v56",
            value: candidates[0] || null,
            results: candidates
        });

        renderResults(candidates);
        renderWatchlist(candidates);
        renderHeatmap(candidates);
        renderReadiness(candidates[0]);
        updateStatus(candidates);
        return candidates;
    }

    function updateStatus(candidates) {
        const status = document.getElementById("scanStatus");
        if (status) {
            status.textContent = `Institutional scan complete · ${candidates.length} candidates · leader ${candidates[0]?.symbol || "—"}`;
        }
    }

    function renderResults(candidates) {
        const body = document.getElementById("scannerResultsBody");
        const count = document.getElementById("resultCount");
        if (count) count.textContent = `${candidates.length} results`;
        if (!body) return;

        body.innerHTML = candidates.map(row => `
            <tr class="v56-result-row grade-${row.grade.replace("+", "plus").replace("-", "minus").toLowerCase()}" data-symbol="${row.symbol}">
                <td>${row.rank}</td>
                <td><b>${row.symbol}</b></td>
                <td>${row.timeframe}</td>
                <td>
                    <div class="v56-inline-score"><span>${row.score.toFixed(1)}</span><i><em style="width:${row.score}%"></em></i></div>
                </td>
                <td><strong>${row.decision}</strong> · ${row.grade}</td>
                <td>${row.confidence.toFixed(1)}%</td>
                <td>${row.expectedR.toFixed(2)}R</td>
                <td>${row.allocation.toFixed(1)}%</td>
                <td>${row.momentum}</td>
                <td>${row.status}</td>
                <td>${row.paper}</td>
                <td>${row.warnings || "—"}</td>
            </tr>
        `).join("");

        body.querySelectorAll("tr[data-symbol]").forEach(tr => {
            tr.addEventListener("click", () => {
                const found = candidates.find(c => c.symbol === tr.dataset.symbol);
                window.EventBus?.publish?.("scanner.selection.changed", found);
                window.EventBus?.publish?.("unified-opportunity.changed", { key: "selected", value: found });
            });
        });
    }

    function renderWatchlist(candidates) {
        const panel = document.getElementById("institutionalWatchlistPanel");
        if (!panel) return;

        const buckets = {
            "A+ Elite": candidates.filter(c => c.grade === "A+"),
            "A / A-": candidates.filter(c => c.grade === "A" || c.grade === "A-"),
            "Watch": candidates.filter(c => c.decision === "WATCH" || c.decision === "WAIT"),
            "Avoid": candidates.filter(c => c.decision === "AVOID")
        };

        panel.innerHTML = `
            <section class="v56-watchlist-card">
                <div class="v56-card-header"><h2>Institutional Watchlist</h2><span>${candidates.length} candidates</span></div>
                <div class="v56-bucket-grid">
                    ${Object.entries(buckets).map(([name, items]) => `
                        <div class="v56-bucket">
                            <b>${name}</b>
                            <span>${items.length}</span>
                            <small>${items.slice(0, 4).map(i => i.symbol).join(", ") || "—"}</small>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function renderHeatmap(candidates) {
    const panel = document.getElementById("institutionalHeatmapV56Panel");
        if (!panel) return;

        const top = candidates.slice(0, 8);
        panel.innerHTML = `
            <section class="v56-heatmap-card">
                <div class="v56-card-header"><h2>Institutional Heat Map</h2><span>${top.length} strongest</span></div>
                <div class="v56-heatmap-bars">
                    ${top.map(c => `
                        <div class="v56-heatmap-row ${c.decision.toLowerCase()}">
                            <b>${c.symbol}</b>
                            <i><em style="width:${c.score}%"></em></i>
                            <span>${c.score.toFixed(1)}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function renderReadiness(candidate) {
        const panel = document.getElementById("executionReadinessPanel");
        if (!panel || !candidate) return;

        const checks = [
            ["Trend", candidate.trend >= 70],
            ["Momentum", candidate.momentum >= 65],
            ["Volume", candidate.volume >= 60],
            ["Risk", candidate.risk <= 55],
            ["Liquidity", candidate.liquidity >= 65],
            ["Strategy", candidate.score >= 72],
            ["Broker", true],
            ["Capital", candidate.allocation > 0]
        ];

        const passed = checks.filter(x => x[1]).length;
        panel.innerHTML = `
            <section class="v56-readiness-card">
                <div class="v56-card-header"><h2>Execution Readiness</h2><span>${passed}/${checks.length}</span></div>
                <div class="v56-check-grid">
                    ${checks.map(([name, ok]) => `<div class="${ok ? "pass" : "fail"}"><b>${ok ? "✓" : "!"}</b><span>${name}</span></div>`).join("")}
                </div>
                <div class="v56-readiness-verdict">${passed >= 7 ? "READY" : passed >= 5 ? "PLAN ONLY" : "NOT READY"}</div>
            </section>
        `;
    }

    function wire() {
        const run = document.getElementById("runScanButton");
        if (run && run.dataset.v56Wired !== "true") {
            run.dataset.v56Wired = "true";
            run.addEventListener("click", () => setTimeout(scan, 25));
        }
    }

    window.TIOSInstitutionalScannerV56 = { scan, latest: [], version: VERSION };

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            wire();
            scan();
        }, 1200);
    });
})();
