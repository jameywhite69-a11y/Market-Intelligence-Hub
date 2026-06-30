(function () {
    function renderWorkspaceProfilesPanel() {
        const panel = document.getElementById("workspaceProfilesPanel");
        if (!panel) return;

        const profiles = window.WorkspaceProfiles?.listProfiles?.() || [];

        panel.innerHTML = `
            <section class="workspace-profiles-card">
                <div class="terminal-card-header">
                    <h3>Workspace Profiles</h3>
                    <span>${profiles.length} saved</span>
                </div>

                <div class="workspace-profile-form">
                    <input id="workspaceProfileNameInput" placeholder="Profile name" value="Default">
                    <button id="saveWorkspaceProfileButton">Save</button>
                </div>

                <div class="workspace-profile-list">
                    ${profiles.map(profile => `
                        <div class="workspace-profile-row ${profile.active ? "active" : ""}">
                            <div>
                                <b>${profile.name}</b>
                                <span>${profile.savedAt ? new Date(profile.savedAt).toLocaleString() : "Not saved"}</span>
                            </div>
                            <button data-restore-profile="${profile.name}" class="secondary-button">Load</button>
                        </div>
                    `).join("") || `<p class="muted">No workspace profiles saved.</p>`}
                </div>
            </section>
        `;

        document.getElementById("saveWorkspaceProfileButton")?.addEventListener("click", () => {
            const name = document.getElementById("workspaceProfileNameInput")?.value || "Default";
            window.WorkspaceProfiles?.saveProfile?.(name);
            renderWorkspaceProfilesPanel();
        });

        for (const button of panel.querySelectorAll("[data-restore-profile]")) {
            button.addEventListener("click", () => {
                window.WorkspaceProfiles?.restoreProfile?.(button.dataset.restoreProfile);
                renderWorkspaceProfilesPanel();
            });
        }
    }

    window.EventBus?.subscribe?.("workspace.profile.saved", renderWorkspaceProfilesPanel);
    window.EventBus?.subscribe?.("workspace.profile.deleted", renderWorkspaceProfilesPanel);
    window.EventBus?.subscribe?.("workspace.profile.applied", renderWorkspaceProfilesPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderWorkspaceProfilesPanel, 700));

    window.WorkspaceProfilesPanel = {
        renderWorkspaceProfilesPanel,
    };
})();
