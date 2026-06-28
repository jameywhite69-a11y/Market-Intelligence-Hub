from app.models.series import PriceSeries
from app.models.series_validator import SeriesValidator


def test_series_validator_accepts_valid_series():
    series = PriceSeries(
        symbol="AAPL",
        timeframe="15m",
        open=[1, 2],
        high=[2, 3],
        low=[0, 1],
        close=[1.5, 2.5],
        volume=[100, 200],
    )

    result = SeriesValidator().validate(series)

    assert result.valid
    assert result.errors == []


def test_series_validator_rejects_mismatched_lengths():
    series = PriceSeries(
        close=[1, 2, 3],
        volume=[100],
    )

    result = SeriesValidator().validate(series)

    assert not result.valid
    assert result.errors


def test_series_validator_rejects_empty_series():
    series = PriceSeries()

    result = SeriesValidator().validate(series)

    assert not result.valid
    assert "PriceSeries is empty." in result.errors


def test_series_validator_warns_for_missing_symbol_and_timeframe():
    series = PriceSeries(
        open=[1],
        high=[2],
        low=[0],
        close=[1.5],
        volume=[100],
    )

    result = SeriesValidator().validate(series)

    assert result.valid
    assert "PriceSeries has no symbol." in result.warnings
    assert "PriceSeries has no timeframe." in result.warnings