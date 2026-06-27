import json
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parents[1] / "storage" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


class JsonStore:
    """Small file-backed persistence layer for v22.1.

    This keeps the project dependency-light while giving us a central place
    to later swap in SQLite/Postgres.
    """

    def __init__(self, name: str):
        self.path = DATA_DIR / f"{name}.json"

    def read(self, default: Any):
        if not self.path.exists():
            self.write(default)
            return default
        try:
            return json.loads(self.path.read_text())
        except Exception:
            return default

    def write(self, data: Any) -> None:
        self.path.write_text(json.dumps(data, indent=2))

    def append(self, item: Any) -> list:
        data = self.read([])
        if not isinstance(data, list):
            data = []
        data.insert(0, item)
        self.write(data)
        return data


state_store = JsonStore("workspace_state")
audit_store = JsonStore("audit_log")
orders_store = JsonStore("orders")
positions_store = JsonStore("positions")
strategy_store = JsonStore("strategies")
