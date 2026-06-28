from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.models import (
    IndicatorDefinition,
    IndicatorParameter,
    IndicatorResult,
)
from app.models.series import PriceSeries


class SMAIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Simple Moving Average",
        key="SMA",
        category="trend",
        description="Average price over a fixed lookback period.",
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

        warnings = []
        if len(values) < length:
            warnings.append("Insufficient bars for full SMA length.")

        if not values:
            sma_value = None
        else:
            window = values[-length:]
            sma_value = sum(window) / len(window)

        return IndicatorResult(
            indicator="SMA",
            values={"sma": sma_value},
            metadata={
                "length": length,
                "source": source,
                "bars_used": min(len(values), length),
            },
            warnings=warnings,
        ).model_dump()