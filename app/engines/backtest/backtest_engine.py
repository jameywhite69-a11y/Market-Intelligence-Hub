from app.models.rule import StrategyRuleGraph
from app.engines.data.market_data_service import market_data_service


class BacktestEngine:
    """Lightweight demo backtester for v22.2.

    Uses generated OHLCV data and a simplified EMA/RVOL/price-reclaim style logic.
    This establishes the service/API/UI shape before adding real historical adapters.
    """

    def run(self, graph: StrategyRuleGraph, symbol: str, timeframe: str = "15m", bars: int = 240, initial_capital: float = 10000) -> dict:
        data = market_data_service.historical(symbol, timeframe, bars)["bars"]
        closes = [b["c"] for b in data]

        def ema(values, length):
            if not values:
                return []
            k = 2 / (length + 1)
            out = []
            prev = values[0]
            for v in values:
                prev = v * k + prev * (1 - k)
                out.append(prev)
            return out

        ema29 = ema(closes, 29)
        ema54 = ema(closes, 54)

        trades = []
        in_trade = False
        entry = 0
        entry_i = 0
        equity = initial_capital
        equity_curve = []

        for i, bar in enumerate(data):
            if i < 60:
                equity_curve.append({"bar": i, "equity": round(equity, 2)})
                continue

            trend = ema29[i] > ema54[i]
            reclaim = bar["l"] <= ema29[i] and bar["c"] > ema29[i] and bar["c"] > bar["o"]
            signal = trend and reclaim

            if not in_trade and signal:
                in_trade = True
                entry = bar["c"]
                entry_i = i

            elif in_trade:
                exit_signal = bar["c"] < ema54[i] or (i - entry_i) >= 42
                if exit_signal:
                    exit_price = bar["c"]
                    pnl_pct = (exit_price - entry) / entry
                    pnl = equity * 0.10 * pnl_pct
                    equity += pnl
                    trades.append({
                        "entry_bar": entry_i,
                        "exit_bar": i,
                        "entry": round(entry, 2),
                        "exit": round(exit_price, 2),
                        "pnl": round(pnl, 2),
                        "pnl_pct": round(pnl_pct * 100, 2),
                        "bars_held": i - entry_i,
                    })
                    in_trade = False

            equity_curve.append({"bar": i, "equity": round(equity, 2)})

        wins = [t for t in trades if t["pnl"] > 0]
        losses = [t for t in trades if t["pnl"] <= 0]
        gross_win = sum(t["pnl"] for t in wins)
        gross_loss = abs(sum(t["pnl"] for t in losses))
        profit_factor = round(gross_win / gross_loss, 2) if gross_loss else None
        win_rate = round(len(wins) / len(trades) * 100, 2) if trades else 0
        net_pnl = round(equity - initial_capital, 2)

        return {
            "strategy": graph.name,
            "symbol": symbol,
            "timeframe": timeframe,
            "bars": bars,
            "initial_capital": initial_capital,
            "ending_equity": round(equity, 2),
            "net_pnl": net_pnl,
            "net_pnl_pct": round(net_pnl / initial_capital * 100, 2),
            "trades": trades,
            "trade_count": len(trades),
            "win_rate": win_rate,
            "profit_factor": profit_factor,
            "avg_trade": round(net_pnl / len(trades), 2) if trades else 0,
            "equity_curve": equity_curve,
        }


backtest_engine = BacktestEngine()
