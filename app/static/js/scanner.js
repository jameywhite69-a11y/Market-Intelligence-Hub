let lastScannerResult = null;

async function runInstitutionalScanner(){
  if(!activeRuleGraph) {
    flash("Rule graph not loaded yet.");
    return;
  }
  const symbols = state.watchlists[state.active_watchlist] || [];
  const result = await api("/api/scanner/scan", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({graph:activeRuleGraph, symbols})
  });
  lastScannerResult = result;
  renderInstitutionalScanner(result);
}

async function runTemplateScanner(){
  const symbols = state.watchlists[state.active_watchlist] || [];
  const result = await api("/api/scanner/scan-templates", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({symbols})
  });
  renderTemplateScanner(result);
}

function renderInstitutionalScanner(result){
  const box = document.getElementById("institutionalScannerBox");
  if(!box) return;

  box.innerHTML = `
    <div class="scanner-summary">
      <b>${result.strategy}</b> · ${result.count} symbols · ${result.logic}
      <button onclick="applyScannerSort()">Apply Auto-Sort</button>
    </div>
    <div class="opportunity-queue">
      ${result.opportunity_queue.map(row=>`
        <div class="opportunity-card ${row.signal==='READY'?'ready':'wait'}" onclick="selectSymbol('${row.symbol}')">
          <div class="rank">#${row.rank}</div>
          <div><b>${row.symbol}</b><br><small>${row.strategy}</small></div>
          <div class="grade">${row.grade}</div>
          <div>${row.confidence}%<br><small>${row.signal}</small></div>
        </div>
      `).join("")}
    </div>
    <div class="heatmap-grid">
      ${result.heatmap.map(h=>`
        <div class="heat-cell ${h.signal==='READY'?'ready':'wait'}" style="opacity:${Math.max(.45,h.intensity/100)}" onclick="selectSymbol('${h.symbol}')">
          <b>${h.symbol}</b><br>${h.confidence}% · ${h.grade}
        </div>
      `).join("")}
    </div>
  `;
}

function renderTemplateScanner(result){
  const box = document.getElementById("institutionalScannerBox");
  if(!box) return;
  box.innerHTML = `
    <div class="scanner-summary"><b>Template Scanner</b> · ${result.strategy_results.length} strategies</div>
    <div class="template-scan-grid">
      ${result.strategy_results.map(strategy=>`
        <div class="template-card">
          <h4>${strategy.strategy}</h4>
          ${strategy.opportunity_queue.slice(0,5).map(row=>`
            <div class="template-row" onclick="selectSymbol('${row.symbol}')">
              <span>#${row.rank} ${row.symbol}</span>
              <b>${row.confidence}% ${row.grade}</b>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function applyScannerSort(){
  if(!lastScannerResult) return;
  state.watchlists[state.active_watchlist] = lastScannerResult.auto_sorted_symbols;
  renderWatchlists();
  saveNow();
  flash("Watchlist auto-sorted by scanner confidence.");
}
