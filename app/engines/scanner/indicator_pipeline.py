from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_engine import IndicatorEngine
from app.engines.indicators.indicator_factory import indicator_factory
from app.engines.indicators.indicators.trend.ema import EMAIndicator
from app.engines.indicators.indicators.trend.hma import HMAIndicator
from app.engines.indicators.indicators.trend.sma import SMAIndicator
from app.engines.indicators.indicators.trend.vwma import VWMAIndicator
from app.engines.indicators.indicators.trend.wma import WMAIndicator
from app.models.series import PriceSeries


def register_scanner_indicators() -> None:
    indicators = {
        "SMA": SMAIndicator,
        "EMA": EMAIndicator,
        "VWMA": VWMAIndicator,
        "WMA": WMAIndicator,
        "HMA": HMAIndicator,
    }

    for key, indicator_class in indicators.items():
        if not indicator_factory.has(key):
            indicator_factory.register(key, indicator_class)


class IndicatorPipeline:
    """Runs requested indicators against a PriceSeries."""

    def __init__(self, indicator_engine: IndicatorEngine | None = None) -> None:
        register_scanner_indicators()
        self.indicator_engine = indicator_engine or IndicatorEngine()

    def run(
        self,
        *,
        series: PriceSeries,
        indicators: list[str],
        parameters: dict[str, dict[str, Any]] | None = None,
    ) -> dict[str, dict[str, Any]]:
        params = parameters or {}
        results: dict[str, dict[str, Any]] = {}

        for indicator in indicators:
            key = indicator.strip().upper()
            results[key] = self.indicator_engine.calculate(
                indicator=key,
                series=series,
                parameters=params.get(key, {}),
            )

        return results


indicator_pipeline = IndicatorPipeline()