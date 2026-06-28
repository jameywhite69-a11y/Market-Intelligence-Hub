from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_cache import IndicatorCacheKey, indicator_cache
from app.engines.indicators.indicator_factory import indicator_factory
from app.models.series import PriceSeries
from app.models.series_builder import series_builder
from app.models.series_validator import SeriesValidator


class IndicatorEngine:
    """Coordinates indicator calculation through PriceSeries."""

    def calculate(
        self,
        *,
        indicator: str,
        bars: list[dict[str, Any]] | None = None,
        series: PriceSeries | None = None,
        symbol: str = "",
        timeframe: str = "",
        parameters: dict[str, Any] | None = None,
        ttl_seconds: int | None = None,
    ) -> dict[str, Any]:
        clean_parameters = parameters or {}

        if series is None:
            series = series_builder.from_bars(
                bars or [],
                symbol=symbol,
                timeframe=timeframe,
            )

        validation = SeriesValidator().validate(series)

        if not validation.valid:
            return {
                "indicator": indicator.strip().upper(),
                "symbol": series.symbol,
                "timeframe": series.timeframe,
                "values": {},
                "signals": {},
                "metadata": {
                    "parameters": clean_parameters,
                },
                "warnings": validation.warnings,
                "errors": validation.errors,
            }

        cache_key = IndicatorCacheKey.build(
            series.symbol,
            series.timeframe,
            indicator,
            clean_parameters,
        )

        cached = indicator_cache.get(cache_key)
        if cached is not None:
            return cached

        implementation = indicator_factory.create(indicator)
        result = implementation.calculate(series, clean_parameters)

        result["symbol"] = series.symbol
        result["timeframe"] = series.timeframe

        existing_warnings = result.get("warnings", [])
        result["warnings"] = existing_warnings + validation.warnings

        indicator_cache.set(cache_key, result, ttl_seconds=ttl_seconds)

        return result


indicator_engine = IndicatorEngine()
engine = indicator_engine