from __future__ import annotations

from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.models import (
    IndicatorDefinition,
    IndicatorParameter,
    IndicatorResult,
)
from app.models.series import PriceSeries


class EMAIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Exponential Moving Average",
        key="EMA",
        category="trend",
        description="Moving average that weights recent prices more heavily.",
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
            warnings.append("Insufficient bars for full EMA length.")

        if not values:
            ema_value = None
        else:
            multiplier = 2 / (length + 1)
            ema_value = values[0]

            for value in values[1:]:
                ema_value = (value - ema_value) * multiplier + ema_value

        return IndicatorResult(
            indicator="EMA",
            values={"ema": ema_value},
            metadata={
                "length": length,
                "source": source,
                "bars_used": len(values),
            },
            warnings=warnings,
        ).model_dump()