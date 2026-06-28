from __future__ import annotations

from typing import Any

from app.models.series import PriceSeries


class SeriesBuilder:
    """Builds PriceSeries objects from raw OHLCV bar dictionaries."""

    def from_bars(
        self,
        bars: list[dict[str, Any]],
        *,
        symbol: str = "",
        timeframe: str = "",
    ) -> PriceSeries:
        return PriceSeries(
            symbol=symbol.strip().upper(),
            timeframe=timeframe.strip(),
            open=[float(bar["open"]) for bar in bars if "open" in bar],
            high=[float(bar["high"]) for bar in bars if "high" in bar],
            low=[float(bar["low"]) for bar in bars if "low" in bar],
            close=[float(bar["close"]) for bar in bars if "close" in bar],
            volume=[float(bar["volume"]) for bar in bars if "volume" in bar],
        )


series_builder = SeriesBuilder()