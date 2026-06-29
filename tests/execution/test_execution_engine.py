from app.engines.execution.execution_engine import ExecutionEngine
from app.engines.execution.order import OrderRequest


def test_execution_engine_buy_and_sell():
    engine = ExecutionEngine(starting_cash=10000, cash=10000)

    buy = engine.submit_order(
        OrderRequest(symbol="BTC", side="buy", quantity=1, order_type="market"),
        market_price=100,
    )

    assert buy.status == "filled"
    assert "BTC" in engine.positions

    sell = engine.submit_order(
        OrderRequest(symbol="BTC", side="sell", quantity=1, order_type="market"),
        market_price=110,
    )

    assert sell.status == "filled"
    assert "BTC" not in engine.positions
    assert engine.snapshot().trade_count == 1
