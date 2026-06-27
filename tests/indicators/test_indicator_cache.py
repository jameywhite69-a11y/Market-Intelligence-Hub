from time import sleep

from app.engines.indicators.indicator_cache import IndicatorCache, IndicatorCacheKey


def test_cache_key_normalizes_symbol_and_indicator():
    key = IndicatorCacheKey.build(
        symbol=" nvda ",
        timeframe="15m",
        indicator=" ema ",
        parameters={"length": 20},
    )

    assert key.symbol == "NVDA"
    assert key.indicator == "EMA"
    assert key.parameters == (("length", 20),)


def test_cache_returns_stored_value():
    cache = IndicatorCache()
    key = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 20})

    cache.set(key, [1, 2, 3])

    assert cache.get(key) == [1, 2, 3]


def test_cache_tracks_hits_and_misses():
    cache = IndicatorCache()
    key = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 20})

    assert cache.get(key) is None
    cache.set(key, [10])
    assert cache.get(key) == [10]

    stats = cache.stats()

    assert stats["hits"] == 1
    assert stats["misses"] == 1
    assert stats["size"] == 1


def test_cache_ttl_expiration():
    cache = IndicatorCache()
    key = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 20})

    cache.set(key, [10], ttl_seconds=0)
    sleep(0.01)

    assert cache.get(key) is None
    assert cache.stats()["size"] == 0


def test_cache_clear_resets_state():
    cache = IndicatorCache()
    key = IndicatorCacheKey.build("AAPL", "15m", "EMA", {"length": 20})

    cache.set(key, [10])
    assert cache.get(key) == [10]

    cache.clear()

    stats = cache.stats()

    assert stats["size"] == 0
    assert stats["hits"] == 0
    assert stats["misses"] == 0