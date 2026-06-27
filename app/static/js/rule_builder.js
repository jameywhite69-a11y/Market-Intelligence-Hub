let activeRuleGraph = null;
let activeRuleCodeTab = "pine";
let generatedRuleCode = {json:"", pine:"", easylanguage:"", python:""};
let ruleTemplates = [];

async function initRuleEngine(){
  activeRuleGraph = await api("/api/rule-engine/default");
  ruleTemplates = await api("/api/rule-engine/templates");
  renderRuleGraph();
}

function renderRuleGraph(){
  const box = document.getElementById("ruleGraphBox");
  if(!box || !activeRuleGraph) return;
  box.innerHTML = `
    <div class="rule-head">
      <input id="ruleGraphName" value="${activeRuleGraph.name}" onchange="activeRuleGraph.name=this.value">
      <select onchange="activeRuleGraph.logic=this.value;renderRuleGraph()">
        <option ${activeRuleGraph.logic==="AND"?"selected":""}>AND</option>
        <option ${activeRuleGraph.logic==="OR"?"selected":""}>OR</option>
      </select>
      <select onchange="loadRuleTemplate(this.value)">
        <option value="">Load Template</option>
        ${ruleTemplates.map((t,i)=>`<option value="${i}">${t.name}</option>`).join("")}
      </select>
      <button onclick="addRule('EMA')">+ EMA</button>
      <button onclick="addRule('ADX')">+ ADX</button>
      <button onclick="addRule('RVOL')">+ RVOL</button>
      <button onclick="addRule('RSI')">+ RSI</button>
      <button onclick="addRule('VWAP')">+ VWAP</button>
      <button onclick="addRule('CANDLE')">+ Candle</button>
      <button onclick="evaluateRuleGraph()">Evaluate</button>
      <button onclick="generateRuleGraphCode()">Generate</button>
      <button onclick="saveRuleGraphToWorkspace()">Save Graph</button>
    </div>
    <div class="rule-flow">
      ${activeRuleGraph.rules.map((r,i)=>`
        <div class="rule-card ${r.enabled?'':'disabled'}">
          <div><b><input value="${r.label}" onchange="activeRuleGraph.rules[${i}].label=this.value"></b></div>
          <div class="mini-row">
            <span>${r.rule_type}</span>
            <select onchange="activeRuleGraph.rules[${i}].operator=this.value">
              ${[">","<",">=","<=","=","reclaim","bullish"].map(o=>`<option ${r.operator===o?'selected':''}>${o}</option>`).join("")}
            </select>
            <input value="${r.value ?? r.right ?? ''}" onchange="setRuleValue(${i},this.value)" placeholder="value">
          </div>
          <label><input type="checkbox" ${r.enabled?'checked':''} onchange="toggleRule(${i},this.checked)"> Enabled</label>
          <button onclick="moveRule(${i},-1)">↑</button>
          <button onclick="moveRule(${i},1)">↓</button>
          <button onclick="removeRule(${i})">Remove</button>
        </div>
        ${i < activeRuleGraph.rules.length-1 ? `<div class="logic-chip">${activeRuleGraph.logic}</div>` : ""}
      `).join("")}
    </div>
    <div id="ruleEvalBox" class="rule-eval">Evaluate the graph to see rule status.</div>
    <div class="code-tabs">
      <button class="code-tab" onclick="setRuleCodeTab('json')">JSON</button>
      <button class="code-tab" onclick="setRuleCodeTab('pine')">Pine</button>
      <button class="code-tab" onclick="setRuleCodeTab('easylanguage')">EasyLanguage</button>
      <button class="code-tab" onclick="setRuleCodeTab('python')">Python</button>
    </div>
    <textarea id="ruleGeneratedCode" class="code-output" spellcheck="false">Generate rule graph code.</textarea>
  `;
}

function loadRuleTemplate(index){
  if(index === "") return;
  activeRuleGraph = JSON.parse(JSON.stringify(ruleTemplates[Number(index)]));
  renderRuleGraph();
}

function addRule(type){
  const id = type.toLowerCase()+"_"+Date.now();
  const defaults = {
    EMA: {label:"EMA29 > EMA54", operator:">", value:null, left:"EMA29", right:"EMA54"},
    ADX: {label:"ADX > 16", operator:">", value:16},
    RVOL:{label:"RVOL > 1.5", operator:">", value:1.5},
    RSI: {label:"RSI > 55", operator:">", value:55},
    VWAP:{label:"Price > VWAP", operator:">", value:"VWAP"},
    CANDLE:{label:"Bullish candle", operator:"bullish", value:null}
  }[type];
  activeRuleGraph.rules.push({id, rule_type:type, enabled:true, params:{}, ...defaults});
  renderRuleGraph();
}

function setRuleValue(i,value){
  const n = Number(value);
  activeRuleGraph.rules[i].value = isNaN(n) ? value : n;
}

function removeRule(i){ activeRuleGraph.rules.splice(i,1); renderRuleGraph(); }
function toggleRule(i,val){ activeRuleGraph.rules[i].enabled = val; renderRuleGraph(); }
function moveRule(i,dir){
  const j=i+dir;
  if(j<0 || j>=activeRuleGraph.rules.length) return;
  [activeRuleGraph.rules[i], activeRuleGraph.rules[j]] = [activeRuleGraph.rules[j], activeRuleGraph.rules[i]];
  renderRuleGraph();
}

async function evaluateRuleGraph(){
  const result = await api(`/api/rule-engine/evaluate/${state.selected_symbol}`, {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(activeRuleGraph)
  });
  document.getElementById("ruleEvalBox").innerHTML = `
    <div><b>${result.signal}</b> · Confidence ${result.confidence}% · ${result.logic}</div>
    ${result.rules.map(r=>`<div class="check"><span>${r.label}</span><span class="${r.passed?'pass':'fail'}">${r.enabled ? (r.passed?'PASS':'FAIL') : 'OFF'} ${r.score}%</span></div>`).join("")}
  `;
}

async function generateRuleGraphCode(){
  const result = await api("/api/rule-engine/generate", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(activeRuleGraph)
  });
  generatedRuleCode = result;
  setRuleCodeTab(activeRuleCodeTab);
}

function setRuleCodeTab(tab){
  activeRuleCodeTab = tab;
  const el = document.getElementById("ruleGeneratedCode");
  if(el) el.value = generatedRuleCode[tab] || "Generate rule graph code.";
}

function saveRuleGraphToWorkspace(){
  state.rule_graph = activeRuleGraph;
  saveNow();
  flash("Rule graph saved to workspace.");
}

window.addEventListener("load", ()=>setTimeout(initRuleEngine, 500));


async function analyzeSelectedSymbol(){
  if(!activeRuleGraph) return;
  const result = await api(`/api/rule-engine/analyze/${state.selected_symbol}`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(activeRuleGraph)
  });
  renderLiveAnalyzer([result]);
  document.getElementById("coach").innerHTML = `
    <div class="coach-score">${result.confidence}%</div>
    <div><b>${result.grade}</b> · ${result.signal}</div>
    <p>${result.coach_note}</p>
  `;
}

async function analyzeActiveWatchlist(){
  if(!activeRuleGraph) return;
  const symbols = state.watchlists[state.active_watchlist] || [];
  const result = await api("/api/rule-engine/analyze-watchlist", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({graph:activeRuleGraph, symbols})
  });
  renderLiveAnalyzer(result);
}

function renderLiveAnalyzer(rows){
  const box = document.getElementById("liveAnalyzerBox");
  if(!box) return;
  box.innerHTML = `
    <div class="analyzer-grid">
      ${rows.map(r=>`
        <div class="analyzer-card ${r.passed?'ready':'wait'}" onclick="selectSymbol('${r.symbol}')">
          <div class="analyzer-symbol">${r.symbol}</div>
          <div class="analyzer-grade">${r.grade}</div>
          <div>${r.signal} · ${r.confidence}%</div>
          <small>${r.readiness_text}</small>
        </div>
      `).join("")}
    </div>
  `;
}
