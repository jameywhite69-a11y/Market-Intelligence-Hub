from __future__ import annotations

from math import sqrt
from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.models import (
    IndicatorDefinition,
    IndicatorParameter,
    IndicatorResult,
)
from app.models.series import PriceSeries


class HMAIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Hull Moving Average",
        key="HMA",
        category="trend",
        description="Fast weighted moving average designed to reduce lag.",
        parameters=[
            IndicatorParameter(
                name="length",
                parameter_type="int",
                default=20,
                minimum=2,
                maximum=500,
                description="Lookback length.",
            ),
            IndicatorParameter(
                name="source",
                parameter_type="str",
                default="close",
                description="OHLCV field to calculate from.",
            ),
        ],
    )

    def calculate(
        self,
        series: PriceSeries,
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        params = parameters or {}
        length = int(params.get("length", 20))
        source = str(params.get("source", "close"))

        values = [float(value) for value in getattr(series, source, [])]
        warnings = []

        if len(values) < length:
            warnings.append("Insufficient bars for full HMA length.")

        hma_value = self._hma(values, length) if values else None

        return IndicatorResult(
            indicator="HMA",
            values={"hma": hma_value},
            metadata={
                "length": length,
                "source": source,
                "bars_used": len(values),
            },
            warnings=warnings,
        ).model_dump()

    def _wma(self, values: list[float]) -> float | None:
        if not values:
            return None

        weights = list(range(1, len(values) + 1))
        return sum(value * weight for value, weight in zip(values, weights)) / sum(weights)

    def _hma(self, values: list[float], length: int) -> float | None:
        if not values:
            return None

        half_length = max(1, length // 2)
        sqrt_length = max(1, int(sqrt(length)))

        raw_values: list[float] = []

        for index in range(len(values)):
            current = values[: index + 1]

            half_window = current[-half_length:]
            full_window = current[-length:]

            half_wma = self._wma(half_window)
            full_wma = self._wma(full_window)

            if half_wma is None or full_wma is None:
                continue

            raw_values.append((2 * half_wma) - full_wma)

        return self._wma(raw_values[-sqrt_length:])