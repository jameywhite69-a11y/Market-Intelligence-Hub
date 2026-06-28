from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.indicator_cache import IndicatorCacheKey, indicator_cache
from app.engines.indicators.indicator_engine import IndicatorEngine
from app.engines.indicators.indicator_factory import indicator_factory
from app.engines.indicators.models import IndicatorDefinition


class EngineDummyIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Engine Dummy",
        key="ENGINE_DUMMY",
        category="custom",
    )

    def calculate(
        self,
        bars: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        return {
            "indicator": "ENGINE_DUMMY",
            "values": [len(bars)],
            "parameters": parameters or {},
        }


def setup_function():
    indicator_cache.clear()
    if not indicator_factory.has("ENGINE_DUMMY"):
        indicator_factory.register("ENGINE_DUMMY", EngineDummyIndicator)


def test_indicator_engine_calculates_through_factory_and_caches_result():
    engine = IndicatorEngine()
    bars = [{"close": 10}, {"close": 11}]

    first = engine.calculate("aapl", "15m", "engine_dummy", bars, {"length": 2})
    second = engine.calculate("AAPL", "15m", "ENGINE_DUMMY", bars, {"length": 2})

    assert first == second
    assert first["symbol"] == "AAPL"
    assert first["timeframe"] == "15m"
    assert first["values"] == [2]

    stats = indicator_cache.stats()
    assert stats["hits"] == 1
    assert stats["misses"] == 1


def test_indicator_engine_cache_key_uses_parameters():
    key_a = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 20})
    key_b = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 50})

    assert key_a != key_b
