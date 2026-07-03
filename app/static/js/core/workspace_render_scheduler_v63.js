/*
Version 63.0 — Workspace Render Scheduler
One render cycle per context-store update.
*/
(function () {
    const VERSION = "63.0";
    let scheduled = false;
    let latest = null;
    const jobs = new Map();

    function register(name, fn) {
        jobs.set(name, fn);
    }

    function schedule(snapshot) {
        latest = snapshot;
        if (scheduled) return;
        scheduled = true;

        requestAnimationFrame(() => {
            scheduled = false;
            const snap = latest;
            jobs.forEach((fn, name) => {
                try { fn(snap); }
                catch (err) { console.warn("[WorkspaceRenderSchedulerV63]", name, err); }
            });
        });
    }

    function init() {
        window.MarketContextStoreV63?.subscribe?.(schedule);
        document.body.dataset.workspaceRenderScheduler = VERSION;
        console.log("[WorkspaceRenderSchedulerV63]", { version: VERSION });
    }

    window.WorkspaceRenderSchedulerV63 = { register, schedule, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1500));
})();
