from app.engines.scanner.watchlist import Watchlist
from app.engines.scanner.watchlist_manager import WatchlistManager


def test_watchlist_normalizes_symbols():
    watchlist = Watchlist(
        name="Tech",
        symbols=[" aapl ", "MSFT", "aapl"],
    )

    assert watchlist.normalized_symbols() == ["AAPL", "MSFT"]


def test_watchlist_add_and_remove_symbol():
    watchlist = Watchlist(name="Tech")

    watchlist.add_symbol(" aapl ")
    watchlist.add_symbol("AAPL")
    watchlist.remove_symbol("aapl")

    assert watchlist.symbols == []


def test_watchlist_manager_creates_and_gets_watchlist():
    manager = WatchlistManager()
    watchlist = Watchlist(name="Tech", symbols=["AAPL"])

    manager.create(watchlist)

    assert manager.get("tech") is watchlist


def test_watchlist_manager_adds_and_removes_symbol():
    manager = WatchlistManager()
    manager.create(Watchlist(name="Crypto"))

    manager.add_symbol("crypto", "btc")
    manager.remove_symbol("crypto", "BTC")

    assert manager.get("Crypto").symbols == []


def test_watchlist_manager_lists_sorted_watchlists():
    manager = WatchlistManager()
    manager.create(Watchlist(name="Zeta"))
    manager.create(Watchlist(name="Alpha"))

    names = [watchlist.name for watchlist in manager.list()]

    assert names == ["Alpha", "Zeta"]