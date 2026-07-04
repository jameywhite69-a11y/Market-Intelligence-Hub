
(function(){
const templates={
trend:`EMA20 > EMA50 AND RSI > 55`,
breakout:`Price > Prior High AND RVOL > 2`,
mean:`RSI < 30 AND Price < VWAP`
};
function generate(prompt){
 const p=(prompt||"").toLowerCase();
 let rule=templates.trend;
 if(p.includes("break")) rule=templates.breakout;
 if(p.includes("mean")) rule=templates.mean;
 return {
   id:"generated_"+Date.now(),
   version:"1.0.0",
   rule,
   evaluate:function(ctx){return {action:"BUY",confidence:0.75};}
 };
}
function render(){
 const el=document.getElementById("aiStrategyGeneratorPanelV101");
 if(!el)return;
 el.innerHTML=`<section class="v101-card">
 <h2>AI Strategy Generator</h2>
 <textarea id="v101Prompt" placeholder="Describe your strategy..."></textarea>
 <button id="v101Gen">Generate</button>
 <pre id="v101Out"></pre>
 </section>`;
 document.getElementById("v101Gen").onclick=()=>{
   const obj=generate(document.getElementById("v101Prompt").value);
   if(window.StrategySDKV99) window.StrategySDKV99.register(obj);
   document.getElementById("v101Out").textContent=JSON.stringify({id:obj.id,rule:obj.rule},null,2);
 };
}
window.AIStrategyGeneratorV101={generate,render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
