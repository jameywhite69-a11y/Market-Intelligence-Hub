(function(){
const VERSION="88.0", KEY="mih.tios.oms.v88";
const DEFAULT_STATE={orders:[],audit:[],nextSeq:1};
function clone(x){try{return JSON.parse(JSON.stringify(x));}catch{return x;}}
function load(){try{return {...DEFAULT_STATE,...(JSON.parse(localStorage.getItem(KEY))||{})};}catch{return clone(DEFAULT_STATE);}}
function save(state){localStorage.setItem(KEY,JSON.stringify(state));publish();render();return state;}
function audit(state,message,data){state.audit.unshift({time:new Date().toLocaleTimeString(),message,data:data||{}});state.audit=state.audit.slice(0,150);}
function latestOpportunity(){return window.LiveOpportunityEngineV79?.latest?.()?.[0]||{};}
function aiRecommendation(){return window.AITradingAssistantV82?.recommendation?.()||{};}
function createOrderFromOpportunity(opportunity){
 const state=load(), o=opportunity||latestOpportunity(), ai=aiRecommendation();
 const order={id:`OMS-${String(state.nextSeq).padStart(5,"0")}`,seq:state.nextSeq,symbol:o.symbol||ai.symbol||"—",side:"BUY",orderType:"MARKET",qty:0,entry:Number(o.entry||o.price||ai.entry||0),stop:Number(o.stop||ai.stop||0),tp1:Number(o.tp1||ai.tp1||0),tp2:Number(o.tp2||ai.tp2||0),score:Number(o.score||ai.score||0),confidence:Number(o.confidence||ai.confidence||0),status:"NEW",fillPct:0,source:"V88 OMS",paperOnly:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 const acct=window.PaperTradingAccountV80?.snapshot?.()||{equity:100000};
 const riskDollars=Number(acct.equity||100000)*0.005;
 const riskPerUnit=Math.max(0.01,Math.abs(order.entry-order.stop));
 order.qty=Math.max(1,Math.floor(riskDollars/riskPerUnit));
 order.notional=Number((order.qty*order.entry).toFixed(2));
 state.nextSeq+=1;state.orders.unshift(order);audit(state,`Created OMS order ${order.id}`,order);save(state);
 window.EventBus?.publish?.("oms-v88.order-created",{order,oms:snapshot()});
 return order;
}
function findOrderMutable(state,orderId){return state.orders.find(o=>o.id===orderId)||null;}
function validateOrder(orderId){
 const state=load(), order=findOrderMutable(state,orderId)||state.orders[0]; if(!order)return null;
 const errors=[];
 if(!order.symbol||order.symbol==="—")errors.push("Missing symbol");
 if(!(Number(order.qty)>0))errors.push("Quantity must be positive");
 if(!(Number(order.entry)>0))errors.push("Entry must be positive");
 if(!(Number(order.stop)>0))errors.push("Stop must be positive");
 if(order.paperOnly!==true)errors.push("Live routing blocked");
 order.validationErrors=errors;order.status=errors.length?"REJECTED":"VALIDATED";order.updatedAt=new Date().toISOString();
 audit(state,`${order.id} ${order.status}`,{errors});save(state);return order;
}
function queueOrder(orderId){
 let state=load(), order=findOrderMutable(state,orderId)||state.orders[0]; if(!order)return null;
 if(order.status==="NEW"){const validated=validateOrder(order.id);if(!validated||validated.status!=="VALIDATED")return validated;}
 state=load();order=findOrderMutable(state,orderId)||state.orders[0]; if(!order)return null;
 order.status="QUEUED";order.queuedAt=new Date().toISOString();order.updatedAt=new Date().toISOString();
 audit(state,`Queued OMS order ${order.id}`,order);save(state);window.EventBus?.publish?.("oms-v88.order-queued",{order,oms:snapshot()});return order;
}
function markFilled(orderId,fillData){
 const state=load(), order=findOrderMutable(state,orderId); if(!order)return null;
 order.status="FILLED";order.fillPct=100;order.filledAt=new Date().toISOString();order.updatedAt=new Date().toISOString();order.fillData=fillData||{};
 audit(state,`Filled OMS order ${order.id}`,order);save(state);window.EventBus?.publish?.("oms-v88.order-filled",{order,fillData,oms:snapshot()});return order;
}
function submitOrder(orderId){
 const state=load(), order=findOrderMutable(state,orderId)||state.orders[0]; if(!order)return null;
 if(!["VALIDATED","QUEUED"].includes(order.status))order.status="QUEUED";
 order.status="SENT";order.sentAt=new Date().toISOString();order.updatedAt=new Date().toISOString();audit(state,`Sent OMS order ${order.id} to paper account`,order);save(state);
 const paperOrder=window.PaperTradingAccountV80?.stageOrder?.({symbol:order.symbol,entry:order.entry,price:order.entry,stop:order.stop,tp1:order.tp1,tp2:order.tp2,score:order.score,confidence:order.confidence});
 if(paperOrder&&window.PaperTradingAccountV80?.submitOrder){const fill=window.PaperTradingAccountV80.submitOrder(paperOrder.id);markFilled(order.id,fill);}
 return order;
}
function cancelOrder(orderId){
 const state=load(), order=findOrderMutable(state,orderId)||state.orders[0]; if(!order)return null;
 if(["FILLED","CANCELLED"].includes(order.status))return order;
 order.status="CANCELLED";order.cancelledAt=new Date().toISOString();order.updatedAt=new Date().toISOString();
 audit(state,`Cancelled OMS order ${order.id}`,order);save(state);window.EventBus?.publish?.("oms-v88.order-cancelled",{order,oms:snapshot()});return order;
}
function reset(){localStorage.removeItem(KEY);render();publish();}
function snapshot(){return load();}
function publish(){window.EventBus?.publish?.("oms-v88.updated",{version:VERSION,oms:snapshot()});}
function render(){
 const panel=document.getElementById("orderManagementSystemPanelV88"); if(!panel)return;
 const s=snapshot(); const counts={total:s.orders.length,queued:s.orders.filter(o=>o.status==="QUEUED").length,sent:s.orders.filter(o=>o.status==="SENT").length,filled:s.orders.filter(o=>o.status==="FILLED").length,rejected:s.orders.filter(o=>o.status==="REJECTED").length};
 panel.innerHTML=`<section class="v88-card"><div class="v88-header"><div><h2>Professional Order Management System</h2><span>paper OMS · validation · queue · fills · audit</span></div><strong>${counts.total} ORDERS</strong></div><div class="v88-grid"><div><small>Total</small><b>${counts.total}</b></div><div><small>Queued</small><b>${counts.queued}</b></div><div><small>Sent</small><b>${counts.sent}</b></div><div><small>Filled</small><b>${counts.filled}</b></div><div><small>Rejected</small><b>${counts.rejected}</b></div><div><small>Mode</small><b>PAPER</b></div></div><div class="v88-actions"><button id="v88CreateOrder">Create From Top Opportunity</button><button id="v88ValidateLatest">Validate Latest</button><button id="v88QueueLatest">Queue Latest</button><button id="v88SubmitLatest">Submit Latest</button><button id="v88CancelLatest">Cancel Latest</button><button id="v88ResetOms">Reset OMS</button></div></section>`;
 document.getElementById("v88CreateOrder")?.addEventListener("click",()=>createOrderFromOpportunity());
 document.getElementById("v88ValidateLatest")?.addEventListener("click",()=>validateOrder(snapshot().orders[0]?.id));
 document.getElementById("v88QueueLatest")?.addEventListener("click",()=>queueOrder(snapshot().orders[0]?.id));
 document.getElementById("v88SubmitLatest")?.addEventListener("click",()=>submitOrder(snapshot().orders[0]?.id));
 document.getElementById("v88CancelLatest")?.addEventListener("click",()=>cancelOrder(snapshot().orders[0]?.id));
 document.getElementById("v88ResetOms")?.addEventListener("click",reset);
}
function wire(){window.EventBus?.subscribe?.("live-opportunities.updated",render);window.EventBus?.subscribe?.("ai-trading-assistant.updated",render);setTimeout(render,1600);}
window.OrderManagementSystemV88={createOrderFromOpportunity,validateOrder,queueOrder,submitOrder,cancelOrder,markFilled,snapshot,reset,render,version:VERSION};
document.addEventListener("DOMContentLoaded",()=>setTimeout(wire,1000));
})();
