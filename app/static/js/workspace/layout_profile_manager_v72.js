/*
Version 72.0 — Layout Profile Manager
Creates simple named workspace profiles.
*/
(function () {
    const VERSION = "72.0";
    const KEY = "mih.tios.layout.profiles.v72";

    function profiles() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || ["Institutional Default", "Execution Focus", "Research Mode", "Diagnostics Mode"];
        } catch {
            return ["Institutional Default", "Execution Focus", "Research Mode", "Diagnostics Mode"];
        }
    }

    function saveProfiles(list) {
        localStorage.setItem(KEY, JSON.stringify(list));
        render();
        return list;
    }

    function activate(name) {
        window.WorkspacePersistenceManagerV72?.save?.({ profile: name });
        render();
    }

    function add(name) {
        name = (name || "").trim();
        if (!name) return;
        const list = profiles();
        if (!list.includes(name)) list.push(name);
        saveProfiles(list);
        activate(name);
    }

    function render() {
        const panel = document.getElementById("layoutProfileManagerPanelV72");
        if (!panel) return;

        const list = profiles();
        const active = window.WorkspacePersistenceManagerV72?.load?.()?.profile || "Institutional Default";

        panel.innerHTML = `
            <section class="v72-card">
                <div class="v72-header">
                    <div>
                        <h2>Layout Profile Manager</h2>
                        <span>saved workspace profiles</span>
                    </div>
                    <strong>${active}</strong>
                </div>

                <div class="v72-profile-list">
                    ${list.map(name => `
                        <button class="${name === active ? "active" : ""}" data-profile="${name}">
                            ${name}
                        </button>
                    `).join("")}
                </div>

                <div class="v72-inline">
                    <input id="v72NewProfileName" placeholder="New profile name">
                    <button id="v72AddProfile">Add Profile</button>
                </div>
            </section>
        `;

        panel.querySelectorAll("[data-profile]").forEach(btn => {
            btn.addEventListener("click", () => activate(btn.dataset.profile));
        });

        document.getElementById("v72AddProfile")?.addEventListener("click", () => {
            add(document.getElementById("v72NewProfileName")?.value);
        });
    }

    window.LayoutProfileManagerV72 = { profiles, add, activate, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1400));
})();
