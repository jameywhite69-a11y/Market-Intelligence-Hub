from app.engines.market_intelligence.technical_engine import technical_engine
from app.models.series import PriceSeries


def test_technical_engine_returns_levels():
    series = PriceSeries(
        symbol="TEST",
        timeframe="15m",
        open=[10, 11, 12, 13, 14, 15],
        high=[11, 12, 13, 14, 15, 16],
        low=[9, 10, 11, 12, 13, 14],
        close=[10.5, 11.5, 12.5, 13.5, 14.5, 15.5],
        volume=[100, 120, 130, 140, 150, 160],
    )

    levels = technical_engine.analyze(series)

    assert levels.current_price == 15.5
    assert levels.atr > 0
    assert levels.target_1 != levels.stop_loss
    assert levels.risk_reward_1 > 0
