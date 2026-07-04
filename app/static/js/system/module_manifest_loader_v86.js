/*
Version 86.0 — Module Manifest Loader
Purpose:
- Provides a manifest-driven loader inventory for future releases.
- Does not replace existing _script_loader.html yet.
- Validates script groups, paths, duplicates, and intended ownership.
- No broker execution.
*/
(function () {
    const VERSION = "86.0";

    const MANIFEST = {
        core: [
            "/static/js/core/dom_registry.js",
            "/static/js/core/event_bus.js",
            "/static/js/core/event_state_engine_v58.js",
            "/static/js/core/state_render_scheduler_v58.js",
            "/static/js/core/core_event_dispatcher_v75.js",
            "/static/js/core/module_registry_v76.js"
        ],
        system: [
            "/static/js/system/platform_settings_store_v70.js",
            "/static/js/system/release_candidate_dashboard_v70.js",
            "/static/js/system/production_polish_controller_v71.js",
            "/static/js/system/platform_module_inventory_v85_1.js",
            "/static/js/system/loader_path_validator_v85_1.js",
            "/static/js/system/panel_id_validator_v85_1.js"
        ],
        workspace: [
            "/static/js/workspace/workspace_persistence_manager_v72.js",
            "/static/js/workspace/layout_profile_manager_v72.js",
            "/static/js/workspace/panel_registry_v77.js",
            "/static/js/workspace/native_docking_manager_v77.js"
        ],
        market: [
            "/static/js/market/realtime_data_bus_v74.js",
            "/static/js/market/market_data_adapter_registry_v78.js",
            "/static/js/market/realtime_data_bus_adapter_bridge_v78.js",
            "/static/js/market/streaming_market_data_bus_v85.js",
            "/static/js/market/candle_stream_panel_v85.js",
            "/static/js/market/stream_health_panel_v85.js"
        ],
        scanner: [
            "/static/js/scanner/institutional_scanner_engine_v56.js",
            "/static/js/scanner/live_opportunity_engine_v79.js",
            "/static/js/scanner/live_opportunity_tape_v79.js",
            "/static/js/scanner/live_opportunity_health_v79.js"
        ],
        ai: [
            "/static/js/ai/ai_trading_commander_panel.js",
            "/static/js/ai/ai_trade_review_engine_v68.js",
            "/static/js/ai/ai_trading_assistant_v82.js",
            "/static/js/ai/ai_trade_guidance_panel_v82.js",
            "/static/js/ai/ai_assistant_health_v82.js"
        ],
        paper: [
            "/static/js/paper/paper_trading_account_v80.js",
            "/static/js/paper/paper_order_ticket_v80.js",
            "/static/js/paper/paper_positions_panel_v80.js",
            "/static/js/paper/position_risk_manager_v81.js",
            "/static/js/paper/paper_trading_command_center_v83.js",
            "/static/js/paper/paper_trade_journal_v84.js"
        ],
        execution: [
            "/static/js/execution/execution_workflow_engine_v60.js",
            "/static/js/execution/execution_console_v60.js",
            "/static/js/execution/live_order_manager_v66.js"
        ],
        broker: [
            "/static/js/broker/execution_service_v65.js",
            "/static/js/broker/broker_adapter_registry_v65.js",
            "/static/js/broker/order_lifecycle_panel_v65.js"
        ],
        portfolio: [
            "/static/js/portfolio/portfolio_intelligence_store_v64.js",
            "/static/js/portfolio/exposure_engine_v64.js",
            "/static/js/portfolio/correlation_engine_v64.js",
            "/static/js/portfolio/portfolio_health_dashboard_v64.js"
        ],
        risk: [
            "/static/js/risk/risk_budget_engine_v64.js",
            "/static/js/risk/position_size_calculator_v57.js"
        ],
        analytics: [
            "/static/js/analytics/performance_analytics_engine_v67.js",
            "/static/js/analytics/performance_dashboard_v67.js",
            "/static/js/analytics/equity_curve_panel_v67.js",
            "/static/js/analytics/strategy_ranking_panel_v67.js"
        ],
        automation: [
            "/static/js/automation/workflow_automation_engine_v69.js",
            "/static/js/automation/alert_rule_builder_v69.js",
            "/static/js/automation/automation_event_log_v69.js"
        ]
    };

    function currentScripts() {
        return Array.from(document.querySelectorAll("script[src]")).map(s => s.getAttribute("src"));
    }

    function flattenManifest() {
        return Object.entries(MANIFEST).flatMap(([group, scripts]) => scripts.map(src => ({ group, src })));
    }

    function validate() {
        const loaded = currentScripts();
        const manifest = flattenManifest();
        const loadedSet = new Set(loaded);
        const manifestSet = new Set(manifest.map(x => x.src));

        const missingFromPage = manifest.filter(item => !loadedSet.has(item.src));
        const unmanagedLoaded = loaded.filter(src => src.startsWith("/static/js/") && !manifestSet.has(src));

        const duplicates = [];
        const seen = new Map();
        loaded.forEach(src => seen.set(src, (seen.get(src) || 0) + 1));
        seen.forEach((count, src) => {
            if (count > 1) duplicates.push({ src, count });
        });

        const wrongGroup = manifest.filter(item => !item.src.includes(`/static/js/${item.group}/`));

        return {
            version: VERSION,
            groups: Object.keys(MANIFEST).length,
            manifestScripts: manifest.length,
            loadedScripts: loaded.length,
            missingFromPage,
            unmanagedLoaded,
            duplicates,
            wrongGroup,
            status: duplicates.length || wrongGroup.length ? "REVIEW" : "READY"
        };
    }

    function render() {
        const panel = document.getElementById("moduleManifestLoaderPanelV86");
        if (!panel) return;

        const v = validate();

        panel.innerHTML = `
            <section class="v86-card ${v.status.toLowerCase()}">
                <div class="v86-header">
                    <div>
                        <h2>Module Manifest Loader</h2>
                        <span>manifest inventory and path ownership validation</span>
                    </div>
                    <strong>${v.status}</strong>
                </div>

                <div class="v86-grid">
                    <div><small>Groups</small><b>${v.groups}</b></div>
                    <div><small>Manifest</small><b>${v.manifestScripts}</b></div>
                    <div><small>Loaded</small><b>${v.loadedScripts}</b></div>
                    <div><small>Missing</small><b>${v.missingFromPage.length}</b></div>
                    <div><small>Unmanaged</small><b>${v.unmanagedLoaded.length}</b></div>
                    <div><small>Duplicates</small><b>${v.duplicates.length}</b></div>
                </div>

                <div class="v86-note">
                    <b>Phase</b>
                    <span>V86 is validation-first. It does not dynamically replace your current script loader yet.</span>
                </div>
            </section>
        `;
    }

    function exportManifest() {
        return JSON.stringify(MANIFEST, null, 2);
    }

    window.ModuleManifestLoaderV86 = {
        manifest: MANIFEST,
        validate,
        exportManifest,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1600));
})();
