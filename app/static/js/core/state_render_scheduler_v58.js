/*
Version 58.0 — State Render Scheduler
Panels can schedule one render per frame instead of repainting repeatedly.
*/
(function () {
    const VERSION = "58.0";
    const queue = new Map();
    let scheduled = false;

    function flush() {
        scheduled = false;
        const jobs = Array.from(queue.entries());
        queue.clear();

        jobs.forEach(([key, job]) => {
            try {
                job();
            } catch (error) {
                console.warn("[TIOS Render Scheduler]", key, error);
            }
        });
    }

    function schedule(key, job) {
        queue.set(key, job);

        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(flush);
        }
    }

    window.TIOSRenderSchedulerV58 = {
        schedule,
        version: VERSION
    };

    console.log("[TIOS Render Scheduler]", { version: VERSION });
})();
