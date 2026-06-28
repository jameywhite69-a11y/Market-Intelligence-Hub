from app.models.series import PriceSeries
from app.engines.indicators.indicators.trend.ema import EMAIndicator
from app.engines.indicators.indicators.trend.hma import HMAIndicator
from app.engines.indicators.indicators.trend.sma import SMAIndicator
from app.engines.indicators.indicators.trend.vwma import VWMAIndicator
from app.engines.indicators.indicators.trend.wma import WMAIndicator


def bars():
    return PriceSeries(
        close=[10, 11, 12, 13, 14],
        volume=[100, 100, 100, 100, 100],
    )


def test_sma_indicator():
    result = SMAIndicator().calculate(bars(), {"length": 3})

    assert result["indicator"] == "SMA"
    assert result["values"]["sma"] == 13


def test_ema_indicator():
    result = EMAIndicator().calculate(bars(), {"length": 3})

    assert result["indicator"] == "EMA"
    assert result["values"]["ema"] is not None


def test_wma_indicator():
    result = WMAIndicator().calculate(bars(), {"length": 3})

    assert result["indicator"] == "WMA"
    assert round(result["values"]["wma"], 4) == 13.3333


def test_vwma_indicator():
    result = VWMAIndicator().calculate(bars(), {"length": 3})

    assert result["indicator"] == "VWMA"
    assert result["values"]["vwma"] == 13


def test_hma_indicator():
    result = HMAIndicator().calculate(bars(), {"length": 3})

    assert result["indicator"] == "HMA"
    assert result["values"]["hma"] is not None


def test_insufficient_bars_warning():
    result = SMAIndicator().calculate(bars(), {"length": 20})

    assert result["warnings"]