function switchWorkspace(name){
  document.querySelectorAll(".workspace").forEach(w=>w.classList.remove("active"));
  const target = document.getElementById("workspace-"+name);
  if(target) target.classList.add("active");

  document.querySelectorAll(".workspace-btn").forEach(b=>b.classList.remove("active"));
  const activeBtn = document.querySelector(`.workspace-btn[data-workspace="${name}"]`);
  if(activeBtn) activeBtn.classList.add("active");

  if(state){
    state.current_workspace = name;
    saveNow();
  }

  if(name === "trading") {
    setTimeout(()=> {
      applyDockMode();
      renderCharts();
      resizeTradingCharts();
    }, 150);
  }
}

function setChartLayout(v){
  if(!state) return;
  state.layout = v;
  applyChartLayout();
  renderCharts();
  saveNow();
}

function applyChartLayout(){
  const grid = document.getElementById("chartGrid");
  if(!grid || !state) return;
  grid.classList.remove("layout-1","layout-2");
  if(state.layout === "1 Chart Focus") grid.classList.add("layout-1");
  if(state.layout === "2 Chart") grid.classList.add("layout-2");
}

function setDockMode(mode){
  if(!state) return;
  state.dock_mode = mode;
  applyDockMode();
  setTimeout(()=>renderCharts(), 100);
  saveNow();
}

function applyDockMode(){
  const tradingGrid = document.querySelector(".trading-grid");
  if(!tradingGrid || !state) return;
  tradingGrid.classList.remove("dock-normal","dock-wide","dock-hidden");
  tradingGrid.classList.add("dock-"+(state.dock_mode || "normal"));
}

function resizeTradingCharts(){
  Object.values(chartObjs || {}).forEach(ch=>{
    try { ch.timeScale().fitContent(); } catch(e) {}
  });
}

function resetLayout(){
  if(!state) return;
  state.current_workspace = "trading";
  state.layout = "4 Chart";
  state.dock_mode = "normal";
  const layoutSelect = document.getElementById("layoutSelect");
  if(layoutSelect) layoutSelect.value = "4 Chart";
  applyChartLayout();
  applyDockMode();
  switchWorkspace("trading");
  saveNow();
  flash("Layout reset to Trading / 4 Chart / Normal.");
}

window.addEventListener("load", ()=>{
  setTimeout(()=>{
    if(state){
      if(!state.current_workspace) state.current_workspace = "trading";
      if(!state.dock_mode) state.dock_mode = "normal";
      const layoutSelect = document.getElementById("layoutSelect");
      if(layoutSelect) layoutSelect.value = state.layout || "4 Chart";
      applyChartLayout();
      applyDockMode();
      switchWorkspace(state.current_workspace);
    }
  }, 1200);
});

window.addEventListener("resize", ()=>{
  if(state && state.current_workspace === "trading"){
    setTimeout(()=>renderCharts(), 100);
  }
});
