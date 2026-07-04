/*
Version 91.0 — Live Execution Simulation Engine
Purpose:
- Simulates exchange/broker fills while remaining paper-safe.
- Supports market-style execution, slippage, latency, partial fills, and OMS events.
- No live broker execution.
*/
(function(){
const VERSION="91.0";
const KEY="mih.tios.execution.sim.v91";

const DEFAULT_STATE={
    enabled:true,
    slippageBps:8,
    latencyMs:350,
    partialFillEnabled:true,
    maxPartialPct:55,
    fills:[],
    events:[]
};

function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(state){localStorage.setItem(KEY,JSON.stringify(state));publish();render();return state;}
function log(state,message,data){state.events.unshift({time:new Date().toLocaleTimeString(),message,data:data||{}});state.events=state.events.slice(0,150);}
function quote(symbol){return window.StreamingMarketDataBusV85?.snapshot?.()?.quotes?.[symbol]||{};}
function latestOmsOrder(){return window.OrderManagementSystemV88?.snapshot?.()?.orders?.[0]||null;}
function fillPrice(order){
    const q=quote(order.symbol);
    const base=Number(q.price||order.entry||0);
    const slip=base*(Number(load().slippageBps||0)/10000);
    return Number((order.side==="SELL"?base-slip:base+slip).toFixed(4));
}
function simulate(order){
    order=order||latestOmsOrder();
    if(!order)return null;
    const state=load();
    if(!state.enabled){
        log(state,"Execution simulator disabled",{order});
        save(state);
        return null;
    }
    if(order.paperOnly===false){
        log(state,"Blocked non-paper order",{order});
        save(state);
        return null;
    }

    const fillPct=state.partialFillEnabled?Math.min(100,Math.max(25,Math.round(Math.random()*state.maxPartialPct))):100;
    const qty=Math.max(1,Math.floor(Number(order.qty||1)*(fillPct/100)));
    const fill={
        id:`SIMFILL-${Date.now()}`,
        orderId:order.id||"manual",
        symbol:order.symbol,
        side:order.side||"BUY",
        qty,
        requestedQty:Number(order.qty||qty),
        fillPct,
        price:fillPrice(order),
        latencyMs:Number(state.latencyMs||0),
        slippageBps:Number(state.slippageBps||0),
        status:fillPct>=100?"FILLED":"PARTIALLY_FILLED",
        timestamp:new Date().toISOString()
    };

    state.fills.unshift(fill);
    state.fills=state.fills.slice(0,200);
    log(state,`Simulated ${fill.status}: ${fill.symbol}`,fill);
    save(state);

    setTimeout(()=>{
        window.EventBus?.publish?.("execution-simulator-v91.fill",fill);
        if(fill.status==="FILLED"){
            window.OrderManagementSystemV88?.markFilled?.(order.id,{simulated:true,fill});
        }
    },fill.latencyMs);

    return fill;
}
function completeLatest(){
    const order=latestOmsOrder();
    if(!order)return null;
    const state=load();
    const fill={id:`SIMFILL-${Date.now()}`,orderId:order.id,symbol:order.symbol,side:order.side||"BUY",qty:Number(order.qty||1),requestedQty:Number(order.qty||1),fillPct:100,price:fillPrice(order),latencyMs:Number(state.latencyMs||0),slippageBps:Number(state.slippageBps||0),status:"FILLED",timestamp:new Date().toISOString()};
    state.fills.unshift(fill);log(state,`Completed simulated fill: ${fill.symbol}`,fill);save(state);
    setTimeout(()=>{window.EventBus?.publish?.("execution-simulator-v91.fill",fill);window.OrderManagementSystemV88?.markFilled?.(order.id,{simulated:true,fill});},fill.latencyMs);
    return fill;
}
function reset(){localStorage.removeItem(KEY);render();publish();}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("execution-simulator-v91.updated",{version:VERSION,state:snapshot()});}
function render(){
    const panel=document.getElementById("executionSimulatorPanelV91");
    if(!panel)return;
    const s=snapshot();
    panel.innerHTML=`<section class="v91-card"><div class="v91-header"><div><h2>Live Execution Simulation Engine</h2><span>paper-safe fills · latency · slippage · partials</span></div><strong>${s.enabled?"ENABLED":"OFF"}</strong></div><div class="v91-grid"><div><small>Fills</small><b>${s.fills.length}</b></div><div><small>Slippage</small><b>${s.slippageBps} bps</b></div><div><small>Latency</small><b>${s.latencyMs} ms</b></div><div><small>Partial</small><b>${s.partialFillEnabled?"ON":"OFF"}</b></div></div><div class="v91-actions"><button id="v91SimLatest">Simulate Latest OMS</button><button id="v91CompleteLatest">Complete Latest</button><button id="v91ResetSim">Reset Simulator</button></div></section>`;
    document.getElementById("v91SimLatest")?.addEventListener("click",()=>simulate());
    document.getElementById("v91CompleteLatest")?.addEventListener("click",completeLatest);
    document.getElementById("v91ResetSim")?.addEventListener("click",reset);
}
function wire(){window.EventBus?.subscribe?.("oms-v88.order-queued",p=>simulate(p?.order));setTimeout(render,1800);}
window.ExecutionSimulatorV91={simulate,completeLatest,snapshot,reset,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
