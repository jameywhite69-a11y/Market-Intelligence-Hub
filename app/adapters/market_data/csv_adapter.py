import csv
from pathlib import Path
from app.adapters.market_data.base import MarketDataAdapter


IMPORT_DIR = Path(__file__).resolve().parents[2] / "storage" / "imports"
IMPORT_DIR.mkdir(parents=True, exist_ok=True)


class CsvMarketDataAdapter(MarketDataAdapter):
    """CSV historical data adapter.

    Expected CSV columns:
    time,open,high,low,close,volume

    Aliases accepted:
    date -> time
    o/h/l/c/v -> open/high/low/close/volume
    """

    def _find_file(self, symbol: str, timeframe: str) -> Path | None:
        candidates = [
            IMPORT_DIR / f"{symbol.upper()}_{timeframe}.csv",
            IMPORT_DIR / f"{symbol.upper()}.csv",
            IMPORT_DIR / f"{symbol.lower()}_{timeframe}.csv",
            IMPORT_DIR / f"{symbol.lower()}.csv",
        ]
        for path in candidates:
            if path.exists():
                return path
        return None

    def quote(self, symbol: str) -> dict:
        hist = self.historical(symbol, "1D", 500)
        bars = hist.get("bars", [])
        if not bars:
            return {
                "symbol": symbol.upper(),
                "last": 0,
                "bid": 0,
                "ask": 0,
                "change": 0,
                "change_pct": 0,
                "volume": 0,
                "provider": "csv",
                "status": "no_csv_data",
            }
        last = bars[-1]
        prev = bars[-2] if len(bars) > 1 else last
        change = last["c"] - prev["c"]
        pct = change / prev["c"] * 100 if prev["c"] else 0
        return {
            "symbol": symbol.upper(),
            "last": round(last["c"], 2),
            "bid": round(last["c"] - 0.01, 2),
            "ask": round(last["c"] + 0.01, 2),
            "change": round(change, 2),
            "change_pct": round(pct, 2),
            "volume": last["v"],
            "provider": "csv",
        }

    def historical(self, symbol: str, timeframe: str, bars: int = 120) -> dict:
        path = self._find_file(symbol, timeframe)
        if not path:
            return {"symbol": symbol.upper(), "tf": timeframe, "bars": [], "provider": "csv", "status": "file_not_found"}

        rows = []
        with path.open(newline="") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                time_value = row.get("time") or row.get("date") or str(i)
                rows.append({
                    "i": i,
                    "time": time_value,
                    "o": float(row.get("open") or row.get("o") or 0),
                    "h": float(row.get("high") or row.get("h") or 0),
                    "l": float(row.get("low") or row.get("l") or 0),
                    "c": float(row.get("close") or row.get("c") or 0),
                    "v": float(row.get("volume") or row.get("v") or 0),
                })

        return {"symbol": symbol.upper(), "tf": timeframe, "bars": rows[-bars:], "provider": "csv", "source_file": path.name}
