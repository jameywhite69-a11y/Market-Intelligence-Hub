from app.models.series import PriceSeries


def test_price_series_basic_properties():
    series = PriceSeries(
        symbol="AAPL",
        timeframe="15m",
        open=[1, 2, 3],
        high=[2, 3, 4],
        low=[0, 1, 2],
        close=[1.5, 2.5, 3.5],
        volume=[100, 200, 300],
    )

    assert series.length() == 3
    assert not series.is_empty()
    assert series.latest_close() == 3.5
    assert series.validate_lengths()


def test_price_series_detects_mismatched_lengths():
    series = PriceSeries(
        close=[1, 2, 3],
        volume=[100],
    )

    assert not series.validate_lengths()


def test_empty_price_series():
    series = PriceSeries()

    assert series.is_empty()
    assert series.latest_close() is None