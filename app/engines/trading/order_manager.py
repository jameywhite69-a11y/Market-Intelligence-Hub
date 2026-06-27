from app.adapters.brokers.paper import PaperBrokerAdapter
from app.core.event_bus import event_bus
from app.core.persistence import orders_store, positions_store
from app.core.audit import log_action


class OrderManager:
    def __init__(self):
        self.broker = PaperBrokerAdapter()

    def place_order(self, order: dict) -> dict:
        result = self.broker.place_order(order)
        orders_store.append(result)
        if result.get("status") == "FILLED":
            positions_store.append(result)
        log_action("order.place", result)
        event_bus.publish("order.placed", result)
        return result

    def flatten_symbol(self, symbol: str) -> dict:
        result = self.broker.flatten_symbol(symbol)
        log_action("order.flatten", result)
        event_bus.publish("order.flatten", result)
        return result


order_manager = OrderManager()
