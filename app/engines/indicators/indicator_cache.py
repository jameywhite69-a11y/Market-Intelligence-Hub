from __future__ import annotations

from dataclasses import dataclass
from time import time
from threading import RLock
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
        normalized_parameters = tuple(sorted((parameters or {}).items()))
        return cls(
            symbol=symbol.strip().upper(),
            timeframe=timeframe.strip(),
            indicator=indicator.strip().upper(),
            parameters=normalized_parameters,
        )


@dataclass
class IndicatorCacheEntry:
    value: Any
    created_at: float
    ttl_seconds: int | None = None

    def expired(self) -> bool:
        if self.ttl_seconds is None:
            return False
        return (time() - self.created_at) > self.ttl_seconds


class IndicatorCache:
    """Thread-safe in-memory cache for indicator results."""

    def __init__(self) -> None:
        self._items: dict[IndicatorCacheKey, IndicatorCacheEntry] = {}
        self._lock = RLock()
        self.hits = 0
        self.misses = 0

    def get(self, key: IndicatorCacheKey) -> Any | None:
        with self._lock:
            entry = self._items.get(key)
            if entry is None:
                self.misses += 1
                return None

            if entry.expired():
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
            self._items[key] = IndicatorCacheEntry(
                value=value,
                created_at=time(),
                ttl_seconds=ttl_seconds,
            )

    def invalidate(self, key: IndicatorCacheKey) -> None:
        with self._lock:
            self._items.pop(key, None)

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