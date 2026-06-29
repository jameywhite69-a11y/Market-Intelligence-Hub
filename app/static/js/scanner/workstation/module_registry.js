/*
Version 32.2 — Startup Cleanup & Module Registry

Single startup coordinator for workstation pages.
Prevents duplicate module bootstraps and gives each module one safe place to initialize.
*/

(function () {
    const registry = {
        started: false,
        modules: new Map(),
        errors: [],
    };

    function register(name, initializer) {
        registry.modules.set(name, {
            name,
            initializer,
            started: false,
            error: null,
        });
    }

    async function start() {
        if (registry.started) {
            console.info("Module registry already started");
            return;
        }

        registry.started = true;

        for (const module of registry.modules.values()) {
            try {
                if (module.started) continue;
                await module.initializer();
                module.started = true;
                console.info(`Module started: ${module.name}`);
            } catch (error) {
                module.error = error;
                registry.errors.push({ module: module.name, error });
                console.error(`Module failed: ${module.name}`, error);
            }
        }
    }

    function status() {
        return Array.from(registry.modules.values()).map(module => ({
            name: module.name,
            started: module.started,
            error: module.error ? module.error.message : null,
        }));
    }

    window.moduleRegistry = {
        register,
        start,
        status,
        registry,
    };
})();
