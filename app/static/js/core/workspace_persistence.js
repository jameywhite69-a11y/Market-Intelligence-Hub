(function () {
    const KEY = "mih.workspace.persistence.v42";
    function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } }
    function save(patch) {
        const next = { ...load(), ...patch, updatedAt: new Date().toISOString() };
        localStorage.setItem(KEY, JSON.stringify(next));
        window.EventBus?.publish?.("workspace.persistence.saved", next);
        return next;
    }
    function saveCurrent() {
        return save({ activeDockTab: localStorage.getItem("mih.activeDockTab") || "execution", context: window.WorkspaceContext?.snapshot?.() || null, url: window.location.pathname });
    }
    function restore() {
        const saved = load();
        if (saved.activeDockTab && window.InstitutionalDockSystem?.activateTab) window.InstitutionalDockSystem.activateTab(saved.activeDockTab);
        if (saved.context && window.WorkspaceContext?.update) window.WorkspaceContext.update(saved.context, "restored");
        window.EventBus?.publish?.("workspace.persistence.restored", saved);
        return saved;
    }
    window.EventBus?.subscribe?.("workspace.context.changed", saveCurrent);
    window.EventBus?.subscribe?.("dock:tab-changed", saveCurrent);
    document.addEventListener("DOMContentLoaded", () => setTimeout(restore, 300));
    window.WorkspacePersistence = { load, save, saveCurrent, restore, reset: () => localStorage.removeItem(KEY) };
})();
