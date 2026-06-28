from app.models.series_builder import SeriesBuilder


def test_series_builder_from_bars():
    bars = [
        {"open": 10, "high": 12, "low": 9, "close": 11, "volume": 100},
        {"open": 11, "high": 13, "low": 10, "close": 12, "volume": 200},
    ]

    series = SeriesBuilder().from_bars(
        bars,
        symbol="aapl",
        timeframe="15m",
    )

    assert series.symbol == "AAPL"
    assert series.timeframe == "15m"
    assert series.open == [10.0, 11.0]
    assert series.high == [12.0, 13.0]
    assert series.low == [9.0, 10.0]
    assert series.close == [11.0, 12.0]
    assert series.volume == [100.0, 200.0]
    assert series.validate_lengths()


def test_series_builder_handles_missing_fields():
    bars = [
        {"close": 10},
        {"close": 11, "volume": 100},
    ]

    series = SeriesBuilder().from_bars(bars)

    assert series.close == [10.0, 11.0]
    assert series.volume == [100.0]
    assert not series.validate_lengths()