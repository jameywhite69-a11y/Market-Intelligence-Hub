from __future__ import annotations

from dataclasses import dataclass
from threading import RLock
from time import time
from typing import Any


@dataclass(frozen=True)
class IndicatorCacheKey:
    symbol: str
    timeframe: str
    indicator: str
    parameters: tuple[tuple[str, Any], ...]

    @classmethod
    def build(
        cls,
        symbol: str,
        timeframe: str,
        indicator: str,
        parameters: dict[str, Any] | None = None,
    ) -> "IndicatorCacheKey":
        return cls(
            symbol.strip().upper(),
            timeframe.strip(),
            indicator.strip().upper(),
            tuple(sorted((parameters or {}).items())),
        )


@dataclass
class IndicatorCacheEntry:
    value: Any
    created_at: float
    ttl_seconds: int | None = None

    def expired(self) -> bool:
        return self.ttl_seconds is not None and (time() - self.created_at) > self.ttl_seconds


class IndicatorCache:
    def __init__(self) -> None:
        self._items: dict[IndicatorCacheKey, IndicatorCacheEntry] = {}
        self._lock = RLock()
        self.hits = 0
        self.misses = 0

    def get(self, key: IndicatorCacheKey) -> Any | None:
        with self._lock:
            entry = self._items.get(key)
            if entry is None or entry.expired():
                self._items.pop(key, None)
                self.misses += 1
                return None

            self.hits += 1
            return entry.value

    def set(
        self,
        key: IndicatorCacheKey,
        value: Any,
        ttl_seconds: int | None = None,
    ) -> None:
        with self._lock:
            self._items[key] = IndicatorCacheEntry(value, time(), ttl_seconds)

    def clear(self) -> None:
        with self._lock:
            self._items.clear()
            self.hits = 0
            self.misses = 0

    def stats(self) -> dict[str, Any]:
        with self._lock:
            total = self.hits + self.misses
            hit_rate = self.hits / total if total else 0

            return {
                "size": len(self._items),
                "hits": self.hits,
                "misses": self.misses,
                "hit_rate": round(hit_rate, 4),
            }


indicator_cache = IndicatorCache()