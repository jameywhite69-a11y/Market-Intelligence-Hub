from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_engine import IndicatorEngine
from app.models.series import PriceSeries


class IndicatorPipeline:
    """Runs requested indicators against a PriceSeries."""

    def __init__(self, indicator_engine: IndicatorEngine | None = None) -> None:
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