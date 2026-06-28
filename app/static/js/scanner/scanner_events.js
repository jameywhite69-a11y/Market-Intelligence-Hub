window.scannerEvents = { emit:(n,d={})=>document.dispatchEvent(new CustomEvent(n,{detail:d})), on:(n,h)=>document.addEventListener(n,h) };
