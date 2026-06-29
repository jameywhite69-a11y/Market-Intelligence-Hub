const watchlistClient = new window.WatchlistApiClient();

function activeWatchlist() {
    return scannerState.watchlists.find(
        watchlist => watchlist.name === scannerDom.watchlistSelect.value
    ) || null;
}

async function loadWatchlists() {
    let payload = await watchlistClient.list();

    if (!payload.watchlists.length) {
        payload = await watchlistClient.seed();
    }

    scannerState.watchlists = payload.watchlists || [];
    renderWatchlistSelector();
    renderActiveWatchlist();
}

function renderWatchlistSelector() {
    scannerDom.watchlistSelect.innerHTML = scannerState.watchlists
        .map(watchlist => `<option value="${watchlist.name}">${watchlist.name}</option>`)
        .join("");

    if (scannerState.watchlists.length && !scannerDom.watchlistSelect.value) {
        scannerDom.watchlistSelect.value = scannerState.watchlists[0].name;
    }
}

function renderActiveWatchlist() {
    const watchlist = activeWatchlist();
    scannerState.activeWatchlist = watchlist;

    if (!watchlist) {
        scannerDom.symbolsInput.value = "";
        scannerDom.watchlistSymbols.innerHTML =
            `<div class="empty-row">No watchlist selected.</div>`;
        return;
    }

    scannerDom.symbolsInput.value = (watchlist.symbols || []).join(",");

    if (!watchlist.symbols?.length) {
        scannerDom.watchlistSymbols.innerHTML =
            `<div class="empty-row">No symbols yet.</div>`;
        return;
    }

    scannerDom.watchlistSymbols.innerHTML = watchlist.symbols
        .map(symbol => `
            <div class="watchlist-symbol-pill">
                <span>${symbol}</span>
                <button data-remove-symbol="${symbol}">×</button>
            </div>
        `).join("");

    for (const button of scannerDom.watchlistSymbols.querySelectorAll("[data-remove-symbol]")) {
        button.addEventListener("click", async () => {
            await watchlistClient.removeSymbol(watchlist.name, button.dataset.removeSymbol);
            await loadWatchlists();
        });
    }
}

async function createWatchlist() {
    const name = scannerDom.newWatchlistName.value.trim();

    if (!name) {
        scannerStatus.setStatus("Enter a watchlist name.", "error");
        return;
    }

    await watchlistClient.create({ name, symbols: [], description: "" });

    scannerDom.newWatchlistName.value = "";
    await loadWatchlists();
    scannerDom.watchlistSelect.value = name;
    renderActiveWatchlist();

    scannerStatus.setStatus(`Created watchlist ${name}.`, "success");
}

async function deleteActiveWatchlist() {
    const watchlist = activeWatchlist();

    if (!watchlist) return;

    await watchlistClient.remove(watchlist.name);
    await loadWatchlists();

    scannerStatus.setStatus(`Deleted watchlist ${watchlist.name}.`, "success");
}

async function addSymbolToActiveWatchlist() {
    const watchlist = activeWatchlist();
    const symbol = scannerDom.addSymbolInput.value.trim();

    if (!watchlist || !symbol) {
        scannerStatus.setStatus("Select a watchlist and enter a symbol.", "error");
        return;
    }

    await watchlistClient.addSymbol(watchlist.name, symbol);
    scannerDom.addSymbolInput.value = "";
    await loadWatchlists();

    scannerStatus.setStatus(`Added ${symbol.toUpperCase()} to ${watchlist.name}.`, "success");
}

function exportActiveWatchlist() {
    const watchlist = activeWatchlist();

    if (!watchlist) {
        scannerStatus.setStatus("No watchlist selected.", "error");
        return;
    }

    const blob = new Blob([(watchlist.symbols || []).join("\n")], {
        type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${watchlist.name}_watchlist.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
    scannerStatus.setStatus("Watchlist exported.", "success");
}

async function importSymbolsToActiveWatchlist() {
    const watchlist = activeWatchlist();

    if (!watchlist) {
        scannerStatus.setStatus("No watchlist selected.", "error");
        return;
    }

    const symbols = scannerUtils.parseCsv(
        scannerDom.importSymbolsInput.value.replaceAll("\n", ",")
    );

    for (const symbol of symbols) {
        await watchlistClient.addSymbol(watchlist.name, symbol);
    }

    scannerDom.importSymbolsInput.value = "";
    await loadWatchlists();

    scannerStatus.setStatus(`Imported ${symbols.length} symbols.`, "success");
}

function bindWatchlistEvents() {
    scannerDom.watchlistSelect?.addEventListener("change", renderActiveWatchlist);
    scannerDom.createWatchlistButton?.addEventListener("click", createWatchlist);
    scannerDom.deleteWatchlistButton?.addEventListener("click", deleteActiveWatchlist);
    scannerDom.addSymbolButton?.addEventListener("click", addSymbolToActiveWatchlist);
    scannerDom.exportWatchlistButton?.addEventListener("click", exportActiveWatchlist);
    scannerDom.importSymbolsInput?.addEventListener("change", importSymbolsToActiveWatchlist);
}

window.watchlistManager = {
    bindWatchlistEvents,
    loadWatchlists,
    renderActiveWatchlist,
};
