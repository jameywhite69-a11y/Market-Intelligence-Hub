from app.engines.indicators.indicator_cache import indicator_cache
from app.engines.indicators.indicator_engine import IndicatorEngine
from app.engines.indicators.indicator_factory import indicator_factory
from app.engines.indicators.indicators.trend.sma import SMAIndicator
from app.models.series import PriceSeries


def setup_function():
    indicator_cache.clear()
    if not indicator_factory.has("SMA"):
        indicator_factory.register("SMA", SMAIndicator)


def test_indicator_engine_accepts_price_series():
    series = PriceSeries(
        symbol="AAPL",
        timeframe="15m",
        open=[1, 2, 3],
        high=[2, 3, 4],
        low=[0, 1, 2],
        close=[10, 11, 12],
        volume=[100, 100, 100],
    )

    result = IndicatorEngine().calculate(
        indicator="SMA",
        series=series,
        parameters={"length": 3},
    )

    assert result["indicator"] == "SMA"
    assert result["symbol"] == "AAPL"
    assert result["timeframe"] == "15m"
    assert result["values"]["sma"] == 11


def test_indicator_engine_accepts_raw_bars():
    bars = [
        {"open": 1, "high": 2, "low": 0, "close": 10, "volume": 100},
        {"open": 2, "high": 3, "low": 1, "close": 11, "volume": 100},
        {"open": 3, "high": 4, "low": 2, "close": 12, "volume": 100},
    ]

    result = IndicatorEngine().calculate(
        indicator="SMA",
        bars=bars,
        symbol="aapl",
        timeframe="15m",
        parameters={"length": 3},
    )

    assert result["indicator"] == "SMA"
    assert result["symbol"] == "AAPL"
    assert result["timeframe"] == "15m"
    assert result["values"]["sma"] == 11


def test_indicator_engine_returns_errors_for_invalid_series():
    series = PriceSeries(
        symbol="AAPL",
        timeframe="15m",
        close=[10, 11],
        volume=[100],
    )

    result = IndicatorEngine().calculate(
        indicator="SMA",
        series=series,
        parameters={"length": 3},
    )

    assert result["indicator"] == "SMA"
    assert result["errors"]


def test_indicator_engine_uses_cache():
    series = PriceSeries(
        symbol="AAPL",
        timeframe="15m",
        open=[1, 2, 3],
        high=[2, 3, 4],
        low=[0, 1, 2],
        close=[10, 11, 12],
        volume=[100, 100, 100],
    )

    engine = IndicatorEngine()

    first = engine.calculate(
        indicator="SMA",
        series=series,
        parameters={"length": 3},
    )
    second = engine.calculate(
        indicator="SMA",
        series=series,
        parameters={"length": 3},
    )

    assert first == second
    assert indicator_cache.stats()["hits"] == 1