(function(){
function render(){
 const el=document.getElementById("visualStrategyBuilderPanelV99");
 if(!el) return;
 el.innerHTML=`<section class="v99-card">
 <h2>Visual Strategy Builder</h2>
 <p>Build strategies using rule blocks.</p>
 <div class="v99-grid">
 <div>Trend<br><select><option>EMA 20 > EMA 50</option></select></div>
 <div>Momentum<br><select><option>RSI > 55</option></select></div>
 <div>Volume<br><select><option>RVOL > 1.5</option></select></div>
 <div>Entry<br><button>Generate Strategy</button></div>
 </div>
 </section>`;
}
window.VisualStrategyBuilderV99={render};
document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
