(function () {
    const modules = new Map();
    function register(module) {
        if (!module || !module.id) return null;
        const record = {
            id: module.id, name: module.name || module.id, category: module.category || "general",
            version: module.version || "1.0", status: module.status || "registered",
            health: module.health || "unknown", startedAt: module.startedAt || null,
            updatedAt: new Date().toISOString(), dependencies: module.dependencies || [], notes: module.notes || ""
        };
        modules.set(record.id, record);
        window.EventBus?.publish?.("module.registered", record);
        return record;
    }
    function setStatus(id, status, health = null) {
        const record = modules.get(id);
        if (!record) return null;
        record.status = status; record.health = health || record.health; record.updatedAt = new Date().toISOString();
        if (status === "ready" || status === "running") record.startedAt = record.startedAt || new Date().toISOString();
        window.EventBus?.publish?.("module.status.changed", record);
        return record;
    }
    function list() { return Array.from(modules.values()); }
    function summary() {
        const rows = list();
        return { total: rows.length, healthy: rows.filter(r => r.health === "healthy").length, failed: rows.filter(r => r.health === "failed").length, rows };
    }
    window.ModuleRegistry = {
        register, setStatus, list, summary,
        markReady: id => setStatus(id, "ready", "healthy"),
        markFailed: (id, error) => { const r = setStatus(id, "failed", "failed"); if (r) r.error = error?.message || String(error); return r; }
    };
})();
