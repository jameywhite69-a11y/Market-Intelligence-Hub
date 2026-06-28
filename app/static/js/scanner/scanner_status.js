window.scannerStatus={
 setStatus(m,t='ready'){scannerDom.statusBox.textContent=`Status: ${m}`;scannerDom.statusBox.dataset.status=t},
 setLoading(v){scannerState.isRunning=v;scannerDom.runButton.disabled=v;scannerDom.runButton.textContent=v?'Scanning...':'Run Scan'}
};
