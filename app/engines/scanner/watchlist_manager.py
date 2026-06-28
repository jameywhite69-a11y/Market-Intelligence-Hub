from __future__ import annotations

from app.engines.scanner.watchlist import Watchlist


class WatchlistManager:
    """Manages named scanner watchlists."""

    def __init__(self) -> None:
        self._watchlists: dict[str, Watchlist] = {}

    def create(self, watchlist: Watchlist) -> Watchlist:
        key = self._key(watchlist.name)
        self._watchlists[key] = watchlist
        return watchlist

    def get(self, name: str) -> Watchlist | None:
        return self._watchlists.get(self._key(name))

    def delete(self, name: str) -> None:
        self._watchlists.pop(self._key(name), None)

    def list(self) -> list[Watchlist]:
        return sorted(self._watchlists.values(), key=lambda item: item.name.lower())

    def add_symbol(self, name: str, symbol: str) -> Watchlist:
        watchlist = self._watchlists[self._key(name)]
        watchlist.add_symbol(symbol)
        return watchlist

    def remove_symbol(self, name: str, symbol: str) -> Watchlist:
        watchlist = self._watchlists[self._key(name)]
        watchlist.remove_symbol(symbol)
        return watchlist

    @staticmethod
    def _key(name: str) -> str:
        return name.strip().lower()


watchlist_manager = WatchlistManager()