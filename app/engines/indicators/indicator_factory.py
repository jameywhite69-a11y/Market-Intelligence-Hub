from __future__ import annotations

from app.engines.indicators.indicator_base import BaseIndicator


class IndicatorFactory:
    """Factory for creating indicator instances by key."""

    def __init__(self) -> None:
        self._implementations: dict[str, type[BaseIndicator]] = {}

    def register(self, key: str, implementation: type[BaseIndicator]) -> None:
        normalized_key = self._normalize_key(key)

        if normalized_key in self._implementations:
            raise ValueError(f"Indicator already registered: {normalized_key}")

        self._implementations[normalized_key] = implementation

    def create(self, key: str) -> BaseIndicator:
        normalized_key = self._normalize_key(key)

        if normalized_key not in self._implementations:
            raise KeyError(f"Indicator is not registered: {normalized_key}")

        return self._implementations[normalized_key]()

    def has(self, key: str) -> bool:
        return self._normalize_key(key) in self._implementations

    def keys(self) -> list[str]:
        return sorted(self._implementations.keys())

    def clear(self) -> None:
        self._implementations.clear()

    @staticmethod
    def _normalize_key(key: str) -> str:
        return key.strip().upper()


indicator_factory = IndicatorFactory()