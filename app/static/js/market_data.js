async function loadMarketDataStatus(){
  const box = document.getElementById("marketDataBox");
  if(!box) return;
  const status = await api("/api/market-data/status");
  box.innerHTML = `
    <div><b>Active provider:</b> ${status.active_provider}</div>
    <div><b>CSV import folder:</b><br><small>${status.csv_import_dir}</small></div>
    <div class="provider-grid">
      ${status.providers.map(p=>`
        <div class="provider-card ${p.provider===status.active_provider?'active':''}">
          <b>${p.provider.toUpperCase()}</b>
          <div>${p.enabled ? 'Enabled' : 'Disabled'}</div>
          <small>${p.notes}</small>
          <button onclick="switchMarketDataProvider('${p.provider}')">Use ${p.provider}</button>
        </div>
      `).join("")}
    </div>
  `;
}

async function switchMarketDataProvider(provider){
  const result = await api("/api/market-data/provider", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({provider})
  });
  flash(`Market data provider switched to ${provider}.`);
  await loadMarketDataStatus();
  renderCharts();
  refreshAll();
}

async function loadCsvImports(){
  const box = document.getElementById("csvImportBox");
  if(!box) return;
  const result = await api("/api/market-data/imports");
  box.innerHTML = `
    <div><b>Folder:</b><br><small>${result.directory}</small></div>
    <div><b>Expected CSV:</b> ${result.expected_format}</div>
    <div><b>Files:</b></div>
    ${result.files.length ? result.files.map(f=>`<div class="import-file">${f}</div>`).join("") : "<div class='status'>No CSV files found yet.</div>"}
  `;
}

window.addEventListener("load", ()=>setTimeout(()=>{loadMarketDataStatus(); loadCsvImports();}, 1200));


async function uploadCsvFile(){
  const input = document.getElementById("csvUploadInput");
  if(!input || !input.files || !input.files[0]){
    flash("Select a CSV file first.");
    return;
  }
  const form = new FormData();
  form.append("file", input.files[0]);
  const r = await fetch("/api/market-data/upload-csv", {method:"POST", body:form});
  const result = await r.json();
  flash(`Uploaded ${result.filename}: ${result.validation.ok ? "valid" : "check columns"}.`);
  await loadCsvImports();
  await loadMarketDataDiagnostics();
}

async function createSampleCsv(){
  const result = await api("/api/market-data/sample-csv", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({symbol:state.selected_symbol, timeframe:"1D", bars:240})
  });
  flash(`Sample CSV created: ${result.filename}`);
  await loadCsvImports();
  await loadMarketDataDiagnostics();
}

async function loadMarketDataDiagnostics(){
  const box = document.getElementById("csvDiagnosticsBox");
  if(!box) return;
  const result = await api("/api/market-data/diagnostics");
  box.innerHTML = `
    <h4>Diagnostics</h4>
    <div><b>Active:</b> ${result.active_provider}</div>
    <div><b>Import dir:</b><br><small>${result.import_dir}</small></div>
    <div class="diag-list">
      ${result.csv_files.length ? result.csv_files.map(f=>`
        <div class="diag-row ${f.validation.ok?'pass-row':'fail-row'}">
          <span>${f.filename}<br><small>${f.validation.rows} rows · ${f.validation.columns.join(", ")}</small></span>
          <b>${f.validation.ok?'OK':'BAD'}</b>
        </div>
      `).join("") : "<div class='status'>No CSV files to diagnose.</div>"}
    </div>
  `;
}
