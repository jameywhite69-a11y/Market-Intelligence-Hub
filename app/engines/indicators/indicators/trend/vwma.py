from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.models import (
    IndicatorDefinition,
    IndicatorParameter,
    IndicatorResult,
)
from app.models.series import PriceSeries


class VWMAIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Volume Weighted Moving Average",
        key="VWMA",
        category="trend",
        description="Moving average weighted by volume.",
        parameters=[
            IndicatorParameter(
                name="length",
                parameter_type="int",
                default=20,
                minimum=1,
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
        volumes = [float(value) for value in series.volume]

        window_values = values[-length:]
        window_volumes = volumes[-length:]

        warnings = []
        if len(window_values) < length or len(window_volumes) < length:
            warnings.append("Insufficient bars for full VWMA length.")

        total_volume = sum(window_volumes)

        if not window_values or not window_volumes or total_volume == 0:
            vwma_value = None
            warnings.append("VWMA could not be calculated because volume is zero or missing.")
        else:
            vwma_value = (
                sum(value * volume for value, volume in zip(window_values, window_volumes))
                / total_volume
            )

        return IndicatorResult(
            indicator="VWMA",
            values={"vwma": vwma_value},
            metadata={
                "length": length,
                "source": source,
                "bars_used": min(len(window_values), len(window_volumes)),
            },
            warnings=warnings,
        ).model_dump()