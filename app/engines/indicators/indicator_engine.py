from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_cache import IndicatorCacheKey, indicator_cache
from app.engines.indicators.indicator_factory import indicator_factory


class IndicatorEngine:
    """Orchestrates indicator calculation.

    The engine never contains indicator-specific calculation logic.
    It resolves indicators from the factory, delegates calculation, and stores
    results in the shared cache.
    """

    def calculate(
        self,
        symbol: str,
        timeframe: str,
        indicator: str,
        bars: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
        *,
        ttl_seconds: int | None = None,
    ) -> dict[str, Any]:
        clean_parameters = parameters or {}
        cache_key = IndicatorCacheKey.build(symbol, timeframe, indicator, clean_parameters)

        cached = indicator_cache.get(cache_key)
        if cached is not None:
            return cached

        implementation = indicator_factory.create(indicator)
        result = implementation.calculate(bars, clean_parameters)

        result.setdefault("indicator", implementation.definition.key)
        result.setdefault("parameters", clean_parameters)
        result["symbol"] = symbol.strip().upper()
        result["timeframe"] = timeframe.strip()

        indicator_cache.set(cache_key, result, ttl_seconds=ttl_seconds)
        return result


indicator_engine = IndicatorEngine()
engine = indicator_engine
