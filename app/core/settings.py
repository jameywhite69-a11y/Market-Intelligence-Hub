from pathlib import Path
import json
from typing import Any


SETTINGS_FILE = Path(__file__).resolve().parents[1] / "platform_settings.json"

DEFAULT_SETTINGS = {
    "version": "22.0",
    "mode": "paper",
    "default_workspace": "trading",
    "chart_engine": "lightweight-charts",
    "market_data_provider": "demo",
    "broker_provider": "paper",
    "risk": {
        "account_size": 300000,
        "risk_pct": 1.0,
        "max_open_risk_pct": 3.0,
    },
}


class SettingsManager:
    def load(self) -> dict[str, Any]:
        if SETTINGS_FILE.exists():
            try:
                return json.loads(SETTINGS_FILE.read_text())
            except Exception:
                return DEFAULT_SETTINGS.copy()
        self.save(DEFAULT_SETTINGS)
        return DEFAULT_SETTINGS.copy()

    def save(self, settings: dict[str, Any]) -> None:
        SETTINGS_FILE.write_text(json.dumps(settings, indent=2))

    def update(self, updates: dict[str, Any]) -> dict[str, Any]:
        settings = self.load()
        settings.update(updates)
        self.save(settings)
        return settings


settings_manager = SettingsManager()
