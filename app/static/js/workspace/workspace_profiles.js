/*
Version 42.8 — Workspace Profiles

Saves and restores named workspace profiles using localStorage.
This becomes the first commercial-grade workspace persistence layer.
*/

(function () {
    const KEY = "mih.workspace.profiles.v42";
    const ACTIVE_KEY = "mih.workspace.active_profile.v42";

    function loadProfiles() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "{}");
        } catch {
            return {};
        }
    }

    function saveProfiles(profiles) {
        localStorage.setItem(KEY, JSON.stringify(profiles));
    }

    function captureState() {
        return {
            context: window.WorkspaceContext?.snapshot?.() || null,
            activeDockTab: localStorage.getItem("mih.activeDockTab") || "execution",
            symbols: document.getElementById("symbolsInput")?.value || "",
            timeframes: document.getElementById("timeframesInput")?.value || "",
            indicators: document.getElementById("indicatorsInput")?.value || "",
            minScore: document.getElementById("minScoreInput")?.value || "0",
            gradeFilter: document.getElementById("gradeFilterSelect")?.value || "all",
            confidenceFilter: document.getElementById("confidenceFilterSelect")?.value || "all",
            savedAt: new Date().toISOString(),
        };
    }

    function applyState(state) {
        if (!state) return;

        if (state.context) {
            window.WorkspaceContext?.update?.(state.context, "profile-restored");
        }

        if (state.activeDockTab) {
            window.InstitutionalDockSystem?.activateTab?.(state.activeDockTab);
        }

        setValue("symbolsInput", state.symbols);
        setValue("timeframesInput", state.timeframes);
        setValue("indicatorsInput", state.indicators);
        setValue("minScoreInput", state.minScore);
        setValue("gradeFilterSelect", state.gradeFilter);
        setValue("confidenceFilterSelect", state.confidenceFilter);

        window.EventBus?.publish?.("workspace.profile.applied", { state });
    }

    function setValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined && value !== null) {
            element.value = value;
            element.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function saveProfile(name) {
        const cleanName = String(name || "Default").trim() || "Default";
        const profiles = loadProfiles();
        profiles[cleanName] = captureState();
        saveProfiles(profiles);
        localStorage.setItem(ACTIVE_KEY, cleanName);

        window.EventBus?.publish?.("workspace.profile.saved", {
            name: cleanName,
            profile: profiles[cleanName],
        });

        return profiles[cleanName];
    }

    function restoreProfile(name) {
        const profiles = loadProfiles();
        const cleanName = name || localStorage.getItem(ACTIVE_KEY) || "Default";
        const profile = profiles[cleanName];

        if (profile) {
            applyState(profile);
            localStorage.setItem(ACTIVE_KEY, cleanName);
        }

        return profile || null;
    }

    function deleteProfile(name) {
        const profiles = loadProfiles();
        delete profiles[name];
        saveProfiles(profiles);
        window.EventBus?.publish?.("workspace.profile.deleted", { name });
    }

    function listProfiles() {
        return Object.entries(loadProfiles()).map(([name, profile]) => ({
            name,
            savedAt: profile.savedAt,
            active: localStorage.getItem(ACTIVE_KEY) === name,
        }));
    }

    function ensureDefaultProfile() {
        const profiles = loadProfiles();
        if (!profiles.Default) {
            saveProfile("Default");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            ensureDefaultProfile();
            restoreProfile();
        }, 600);
    });

    window.WorkspaceProfiles = {
        captureState,
        applyState,
        saveProfile,
        restoreProfile,
        deleteProfile,
        listProfiles,
        loadProfiles,
    };
})();
