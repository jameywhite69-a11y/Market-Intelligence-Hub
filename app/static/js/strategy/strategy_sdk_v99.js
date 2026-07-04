(function(){
const VERSION="99.0";
const strategies=new Map();
function register(def){
 if(!def?.id) throw Error("Strategy id required");
 strategies.set(def.id,{enabled:true,...def});
 window.EventBus?.publish?.("strategy-sdk-v99.registered",def);
}
function evaluate(ctx){
 const out=[];
 strategies.forEach(s=>{
   if(!s.enabled||typeof s.evaluate!=="function") return;
   try{ const sig=s.evaluate(ctx); if(sig) out.push({id:s.id,signal:sig}); }catch(e){console.error(e);}
 });
 return out;
}
window.StrategySDKV99={version:VERSION,register,evaluate,list:()=>[...strategies.values()]};
})();
