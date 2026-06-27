let lastTradeQueue = [];

async function buildSelectedTradePlan(){
  if(!activeRuleGraph) return;
  const result = await api("/api/trade-planner/plan", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      graph: activeRuleGraph,
      symbol: state.selected_symbol,
      account: Number(document.getElementById("plannerAccount")?.value || 300000),
      risk_pct: Number(document.getElementById("plannerRiskPct")?.value || 1),
      price: quote ? quote.last : null
    })
  });
  renderTradePlan(result);
}

async function buildTradeQueue(){
  if(!activeRuleGraph) return;
  const symbols = state.watchlists[state.active_watchlist] || [];
  const result = await api("/api/trade-planner/queue", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      graph: activeRuleGraph,
      symbols,
      account: Number(document.getElementById("plannerAccount")?.value || 300000),
      risk_pct: Number(document.getElementById("plannerRiskPct")?.value || 1)
    })
  });
  lastTradeQueue = result;
  renderTradeQueue(result);
}

function renderTradePlan(plan){
  const box = document.getElementById("tradePlannerBox");
  if(!box) return;
  box.innerHTML = `
    <div class="trade-plan-card ${plan.status==='ACTIONABLE'?'ready':'watch'}">
      <div class="trade-plan-head">
        <b>${plan.symbol}</b>
        <span>${plan.grade} · ${plan.confidence}% · ${plan.status}</span>
      </div>
      <div class="trade-plan-grid">
        <div>Entry<br><b>${plan.entry}</b></div>
        <div>Stop<br><b>${plan.stop}</b></div>
        <div>TP1<br><b>${plan.target1}</b></div>
        <div>TP2<br><b>${plan.target2}</b></div>
        <div>Runner<br><b>${plan.runner}</b></div>
        <div>Qty<br><b>${plan.qty}</b></div>
        <div>Risk $<br><b>${plan.risk_dollars}</b></div>
        <div>R:R<br><b>${plan.rr}</b></div>
      </div>
      <div class="planner-note">${plan.coach_note}</div>
      <button onclick='stageTrade(${JSON.stringify(plan).replaceAll("'", "&apos;")})'>Stage Sim Trade</button>
    </div>
  `;
}

function renderTradeQueue(queue){
  const box = document.getElementById("tradePlannerBox");
  if(!box) return;
  box.innerHTML = `
    <div class="trade-queue">
      ${queue.map((p,i)=>`
        <div class="trade-queue-row ${p.status==='ACTIONABLE'?'ready':'watch'}" onclick="selectSymbol('${p.symbol}')">
          <span>#${i+1} <b>${p.symbol}</b><br><small>${p.strategy}</small></span>
          <span>${p.grade}<br><small>${p.confidence}%</small></span>
          <span>Qty ${p.qty}<br><small>R:R ${p.rr}</small></span>
          <button onclick='event.stopPropagation(); stageTrade(${JSON.stringify(p).replaceAll("'", "&apos;")})'>Stage</button>
        </div>
      `).join("")}
    </div>
  `;
}

function stageTrade(plan){
  if(!state.staged_trades) state.staged_trades = [];
  state.staged_trades.unshift({...plan, staged_time:new Date().toLocaleTimeString()});
  renderStagedTrades();
  saveNow();
  flash(`${plan.symbol} trade staged.`);
}

function renderStagedTrades(){
  const box = document.getElementById("stagedTradesBox");
  if(!box) return;
  const rows = state.staged_trades || [];
  box.innerHTML = rows.length ? rows.map((p,i)=>`
    <div class="staged-row">
      <span><b>${p.symbol}</b> ${p.grade}<br><small>${p.staged_time} · ${p.strategy}</small></span>
      <span>${p.qty} @ ${p.entry}<br><small>SL ${p.stop} TP2 ${p.target2}</small></span>
      <button onclick="executeStagedTrade(${i})">Sim Fill</button>
      <button onclick="removeStagedTrade(${i})">×</button>
    </div>
  `).join("") : "<div class='status'>No staged trades.</div>";
}

function executeStagedTrade(i){
  const p = state.staged_trades[i];
  if(!state.positions) state.positions = [];
  state.positions.unshift({
    symbol:p.symbol,
    strategy:p.strategy,
    side:"LONG",
    qty:p.qty,
    entry:p.entry,
    stop:p.stop,
    target:p.target2,
    position_value:p.position_value,
    time:new Date().toLocaleTimeString()
  });
  state.staged_trades.splice(i,1);
  renderStagedTrades();
  renderPortfolioExposure();
  saveNow();
  flash(`${p.symbol} simulated fill added to positions.`);
}

function removeStagedTrade(i){
  state.staged_trades.splice(i,1);
  renderStagedTrades();
  saveNow();
}

async function renderPortfolioExposure(){
  const box = document.getElementById("portfolioExposureBox");
  if(!box) return;
  const result = await api("/api/trade-planner/exposure", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({positions: state.positions || []})
  });
  box.innerHTML = `
    <div><b>Total Exposure:</b> $${result.total_value}</div>
    <div class="exposure-grid">
      <div><b>By Symbol</b>${result.by_symbol.map(r=>`<div class="exposure-row"><span>${r.symbol}</span><span>$${r.value}</span></div>`).join("")}</div>
      <div><b>By Strategy</b>${result.by_strategy.map(r=>`<div class="exposure-row"><span>${r.strategy}</span><span>$${r.value}</span></div>`).join("")}</div>
    </div>
  `;
}

window.addEventListener("load", ()=>setTimeout(()=>{renderStagedTrades(); renderPortfolioExposure();}, 900));
