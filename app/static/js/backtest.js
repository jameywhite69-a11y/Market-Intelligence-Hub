let lastBacktest = null;

async function runBacktest(){
  if(!activeRuleGraph){
    flash("Rule graph not loaded yet.");
    return;
  }

  const result = await api("/api/backtest/run", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      graph: activeRuleGraph,
      symbol: state.selected_symbol,
      timeframe: document.getElementById("btTimeframe")?.value || "15m",
      bars: Number(document.getElementById("btBars")?.value || 240),
      initial_capital: Number(document.getElementById("btCapital")?.value || 10000)
    })
  });

  lastBacktest = result;
  renderBacktest(result);
}

function renderBacktest(result){
  const box = document.getElementById("backtestBox");
  if(!box) return;

  box.innerHTML = `
    <div class="bt-summary">
      <div><b>${result.symbol}</b><br><small>${result.strategy}</small></div>
      <div>Trades<br><b>${result.trade_count}</b></div>
      <div>Win Rate<br><b>${result.win_rate}%</b></div>
      <div>Net P/L<br><b class="${result.net_pnl>=0?'pass':'fail'}">$${result.net_pnl}</b></div>
      <div>Return<br><b class="${result.net_pnl_pct>=0?'pass':'fail'}">${result.net_pnl_pct}%</b></div>
      <div>PF<br><b>${result.profit_factor ?? 'N/A'}</b></div>
    </div>
    <div class="bt-equity">
      ${result.equity_curve.filter((_,i)=>i%8===0).map(p=>`
        <div class="bt-bar" style="height:${Math.max(8, Math.min(70, 35 + ((p.equity-result.initial_capital)/result.initial_capital)*300))}px" title="Bar ${p.bar}: ${p.equity}"></div>
      `).join("")}
    </div>
    <div class="bt-trades">
      ${result.trades.slice(0,12).map(t=>`
        <div class="bt-trade">
          <span>${t.entry_bar} → ${t.exit_bar}</span>
          <span>${t.entry} → ${t.exit}</span>
          <b class="${t.pnl>=0?'pass':'fail'}">$${t.pnl}</b>
        </div>
      `).join("") || "<div class='status'>No trades generated.</div>"}
    </div>
  `;
}

window.addEventListener("load", ()=>setTimeout(()=>{}, 1000));
