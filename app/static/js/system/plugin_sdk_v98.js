(function(){
const VERSION="98.0";
const registry=new Map();
function register(plugin){
 if(!plugin||!plugin.id) throw new Error("Plugin id required");
 registry.set(plugin.id,{...plugin,enabled:plugin.enabled!==false});
 window.EventBus?.publish?.("plugin-sdk-v98.registered",{plugin});
 return true;
}
function unregister(id){registry.delete(id);}
function list(){return [...registry.values()];}
function invoke(hook,payload){
 list().filter(p=>p.enabled&&typeof p.hooks?.[hook]==="function")
      .forEach(p=>{try{p.hooks[hook](payload);}catch(e){console.error(p.id,e);}});
}
function render(){
 const el=document.getElementById("pluginSdkPanelV98");
 if(!el) return;
 const plugins=list();
 el.innerHTML=`<section class="v98-card"><h2>Plugin SDK</h2>
 <p>Registered Plugins: <b>${plugins.length}</b></p>
 <div>${plugins.map(p=>`<div>${p.id} (${p.version||"?"})</div>`).join("")||"No plugins registered."}</div>
 </section>`;
}
window.PluginSDKV98={version:VERSION,register,unregister,list,invoke,render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
