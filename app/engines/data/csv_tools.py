import csv
import math
import random
import time
from pathlib import Path
from app.adapters.market_data.csv_adapter import IMPORT_DIR


REQUIRED_COLUMNS = ["time", "open", "high", "low", "close", "volume"]


def validate_csv_file(path: Path) -> dict:
    if not path.exists():
        return {"ok": False, "error": "file_not_found", "rows": 0, "columns": []}

    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        columns = reader.fieldnames or []
        rows = list(reader)

    normalized = {c.lower(): c for c in columns}
    accepted = all(c in normalized or {"open":"o","high":"h","low":"l","close":"c","volume":"v","time":"date"}[c] in normalized for c in REQUIRED_COLUMNS)

    return {
        "ok": accepted,
        "rows": len(rows),
        "columns": columns,
        "required": REQUIRED_COLUMNS,
        "error": None if accepted else "missing_required_columns",
    }


def write_upload(filename: str, content: bytes) -> dict:
    safe_name = filename.replace("\\", "_").replace("/", "_")
    if not safe_name.lower().endswith(".csv"):
        safe_name += ".csv"
    path = IMPORT_DIR / safe_name
    path.write_bytes(content)
    validation = validate_csv_file(path)
    return {"filename": safe_name, "path": str(path), "validation": validation}


def create_sample_csv(symbol: str, timeframe: str = "1D", bars: int = 240) -> dict:
    symbol = symbol.upper().strip() or "SAMPLE"
    timeframe = timeframe.strip() or "1D"
    path = IMPORT_DIR / f"{symbol}_{timeframe}.csv"

    random.seed(sum(ord(c) for c in symbol + timeframe))
    price = 100 + (sum(ord(c) for c in symbol) % 180)

    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=REQUIRED_COLUMNS)
        writer.writeheader()
        for i in range(bars):
            drift = math.sin(i / 12) * 0.35 + random.uniform(-0.9, 1.0)
            openp = price
            closep = max(1, openp + drift)
            highp = max(openp, closep) + random.uniform(0.1, 1.2)
            lowp = min(openp, closep) - random.uniform(0.1, 1.2)
            volume = int(500000 + abs(drift) * 800000 + random.randint(0, 1500000))
            writer.writerow({
                "time": int(time.time()) - (bars - i) * 86400,
                "open": round(openp, 2),
                "high": round(highp, 2),
                "low": round(lowp, 2),
                "close": round(closep, 2),
                "volume": volume,
            })
            price = closep

    return {"filename": path.name, "path": str(path), "validation": validate_csv_file(path)}
