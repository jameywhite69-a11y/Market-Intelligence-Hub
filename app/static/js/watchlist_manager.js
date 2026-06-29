const watchlistClient = new window.WatchlistApiClient();

async function loadWatchlists() {
    try {
        const payload = await watchlistClient.list();
        scannerState.watchlists = payload.watchlists || [];
        renderWatchlistSelect();
        renderWatchlistSymbols();
        hydrateSymbolsFromActiveWatchlist();

        if (window.workspaceIntelligence) {
            window.workspaceIntelligence.renderMultiWatchlistDashboard?.();
        }
    } catch (error) {
        console.warn("Watchlist manager unavailable", error);
    }
}

async function seedWatchlists() {
    try {
        await watchlistClient.seed();
        await loadWatchlists();
    } catch (error) {
        console.warn("Watchlist seed unavailable", error);
    }
}

function activeWatchlist() {
    const selectedName = DOMRegistry.value("watchlistSelect", "");
    return scannerState.watchlists.find(item => item.name === selectedName) || scannerState.watchlists[0] || null;
}

function renderWatchlistSelect() {
    const select = DOMRegistry.get("watchlistSelect");
    if (!select) return;

    select.innerHTML = scannerState.watchlists.map(watchlist => `
        <option value="${watchlist.name}">${watchlist.name}</option>
    `).join("");
}

function renderWatchlistSymbols() {
    const container = DOMRegistry.get("watchlistSymbols");
    if (!container) return;

    const watchlist = activeWatchlist();
    const symbols = watchlist?.symbols || [];

    container.innerHTML = symbols.map(symbol => `
        <span class="symbol-chip">
            ${symbol}
            <button data-remove-symbol="${symbol}">×</button>
        </span>
    `).join("");

    for (const button of container.querySelectorAll("[data-remove-symbol]")) {
        button.addEventListener("click", async () => {
            await removeSymbol(button.dataset.removeSymbol);
        });
    }
}

function hydrateSymbolsFromActiveWatchlist() {
    const input = DOMRegistry.get("symbolsInput");
    const watchlist = activeWatchlist();
    if (input && watchlist?.symbols?.length) {
        input.value = watchlist.symbols.join(",");
    }
}

async function createWatchlist() {
    const input = DOMRegistry.get("newWatchlistName");
    const name = input?.value?.trim();
    if (!name) return;

    await watchlistClient.create(name);
    input.value = "";
    await loadWatchlists();
}

async function deleteWatchlist() {
    const watchlist = activeWatchlist();
    if (!watchlist) return;

    await watchlistClient.delete(watchlist.name);
    await loadWatchlists();
}

async function addSymbol() {
    const input = DOMRegistry.get("addSymbolInput");
    const watchlist = activeWatchlist();
    const symbol = input?.value?.trim()?.toUpperCase();

    if (!watchlist || !symbol) return;

    await watchlistClient.addSymbol(watchlist.name, symbol);
    input.value = "";
    await loadWatchlists();
}

async function removeSymbol(symbol) {
    const watchlist = activeWatchlist();
    if (!watchlist || !symbol) return;

    await watchlistClient.removeSymbol(watchlist.name, symbol);
    await loadWatchlists();
}

function exportWatchlist() {
    const watchlist = activeWatchlist();
    if (!watchlist) return;

    const blob = new Blob([watchlist.symbols.join("\\n")], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${watchlist.name}_watchlist.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function bindWatchlistEvents() {
    if (window.watchlistEventsBound) return;
    window.watchlistEventsBound = true;

    DOMRegistry.get("watchlistSelect")?.addEventListener("change", () => {
        renderWatchlistSymbols();
        hydrateSymbolsFromActiveWatchlist();
    });

    DOMRegistry.get("createWatchlistButton")?.addEventListener("click", createWatchlist);
    DOMRegistry.get("deleteWatchlistButton")?.addEventListener("click", deleteWatchlist);
    DOMRegistry.get("addSymbolButton")?.addEventListener("click", addSymbol);
    DOMRegistry.get("exportWatchlistButton")?.addEventListener("click", exportWatchlist);
}

async function bootstrapWatchlists() {
    bindWatchlistEvents();
    await seedWatchlists();
}

window.watchlistManager = {
    bootstrapWatchlists,
    loadWatchlists,
    seedWatchlists,
    activeWatchlist,
    renderWatchlistSelect,
    renderWatchlistSymbols,
    bindWatchlistEvents,
    bindWatchlistView: bootstrapWatchlists,
    renderWatchlistView: renderWatchlistSymbols,
    refreshWatchlists: loadWatchlists,
};
