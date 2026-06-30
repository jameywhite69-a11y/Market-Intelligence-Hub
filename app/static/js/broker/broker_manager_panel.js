(function(){
function render(){
 const el=document.getElementById("brokerManagerPanel"); if(!el) return;
 const broker=(window.WorkspaceContext?.snapshot?.().broker)||"Paper";
 const exec=window.WorkspaceStore?.get?.("executionSnapshot")||{};
 el.innerHTML=`
 <section class="broker-card">
 <div class="terminal-card-header"><h3>Broker Manager</h3><span>${broker}</span></div>
 <div class="broker-grid">
 <div><b>Account</b><span>${broker} Account</span></div>
 <div><b>Buying Power</b><span>$${Number(exec.buying_power||100000).toFixed(2)}</span></div>
 <div><b>Status</b><span>Connected</span></div>
 <div><b>Latency</b><span>-- ms</span></div>
 </div>
 </section>`;
}
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,400));
window.EventBus?.subscribe?.("workspace.context.changed",render);
window.BrokerManagerPanel={render};
})();
