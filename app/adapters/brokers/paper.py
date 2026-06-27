from datetime import datetime
from app.adapters.brokers.base import BrokerAdapter


class PaperBrokerAdapter(BrokerAdapter):
    def __init__(self):
        self.orders = []
        self.positions = []

    def place_order(self, order: dict) -> dict:
        filled = {
            **order,
            "status": "FILLED" if order.get("type", "market").lower() == "market" else "WORKING",
            "broker": "paper",
            "timestamp": datetime.utcnow().isoformat(),
        }
        self.orders.insert(0, filled)
        if filled["status"] == "FILLED":
            self.positions.insert(0, filled)
        return filled

    def flatten_symbol(self, symbol: str) -> dict:
        before = len(self.positions)
        self.positions = [p for p in self.positions if p.get("symbol") != symbol]
        return {"symbol": symbol, "closed": before - len(self.positions), "broker": "paper"}
