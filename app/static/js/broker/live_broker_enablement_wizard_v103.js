(function(){
const VERSION="103.1";
const steps=[
"Verify Production Readiness (V95)",
"Confirm Paper Trading Stability",
"Validate Broker Configuration",
"Review Risk Limits",
"Perform Connection Test (Simulation)",
"Ready for Optional Live Enablement"
];
let idx=0;

function next(){
    if(idx<steps.length-1){
        idx++;
        render();
    }
}

function prev(){
    if(idx>0){
        idx--;
        render();
    }
}

function render(){
    const el=document.getElementById("liveBrokerEnablementWizardPanelV103");
    if(!el) return;

    const gate=window.ProductionReadinessGateV95?.readiness?.();

    el.innerHTML=`<section class="v103-card">
        <h2>Live Broker Enablement Wizard</h2>
        <p><b>Current Step:</b> ${idx+1}/${steps.length}</p>
        <p>${steps[idx]}</p>
        <p><b>Safety Status:</b> ${gate?.eligible ? "Eligible" : "Paper Mode Locked"}</p>
        <div class="note">This wizard never enables live trading. It prepares and validates configuration only.</div>
        <button id="v103Prev">Previous</button>
        <button id="v103Next">Next</button>
    </section>`;

    document.getElementById("v103Prev")?.addEventListener("click", prev);
    document.getElementById("v103Next")?.addEventListener("click", next);
}

window.LiveBrokerEnablementWizardV103={
    render,
    next,
    prev,
    version:VERSION
};

document.addEventListener("DOMContentLoaded",()=>setTimeout(render,1000));
})();
