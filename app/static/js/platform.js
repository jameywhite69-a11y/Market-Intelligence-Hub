async function loadPlatformStatus(){
  const box = document.getElementById("platformStatusBox");
  if(!box) return;
  try{
    const status = await api("/api/platform/status");
    box.innerHTML = `
      <div><b>Version:</b> ${status.version}</div>
      <div><b>Architecture:</b> ${status.architecture}</div>
      <div><b>Market Data:</b> ${status.settings.market_data_provider}</div>
      <div><b>Broker:</b> ${status.settings.broker_provider}</div>
      <div><b>Plugins:</b> ${status.plugins.length}</div>
      <div><b>Workspaces:</b> ${status.workspaces.length}</div>
      <div class="platform-plugin-list">
        ${status.plugins.map(p=>`<div class="plugin-row"><span>${p.name}</span><b>${p.enabled?'ON':'OFF'}</b></div>`).join("")}
      </div>
    `;
  }catch(e){
    box.innerHTML = "Platform status unavailable.";
  }
}

window.addEventListener("load", ()=>setTimeout(loadPlatformStatus, 1000));


async function loadHealth(){
  const box = document.getElementById("healthBox");
  if(!box) return;
  const health = await api("/api/platform/health");
  box.innerHTML = `
    <div><b>Status:</b> ${health.status}</div>
    <div><b>Online:</b> ${health.online}/${health.total}</div>
    <div class="platform-plugin-list">
      ${health.services.map(s=>`<div class="plugin-row"><span>${s.name}<br><small>${s.detail}</small></span><b>${s.status}</b></div>`).join("")}
    </div>
  `;
}

async function loadAudit(){
  const box = document.getElementById("auditBox");
  if(!box) return;
  const rows = await api("/api/platform/audit?limit=10");
  box.innerHTML = rows.length ? rows.map(r=>`
    <div class="audit-row"><b>${r.action}</b><br><small>${r.timestamp}</small></div>
  `).join("") : "No audit events yet.";
}

window.addEventListener("load", ()=>setTimeout(()=>{loadHealth(); loadAudit();}, 1300));
