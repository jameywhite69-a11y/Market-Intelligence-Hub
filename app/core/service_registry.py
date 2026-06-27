from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass
class ServiceStatus:
    name: str
    category: str
    status: str = "online"
    version: str = "22.1"
    detail: str = ""


class ServiceRegistry:
    def __init__(self):
        self._services: dict[str, ServiceStatus] = {}

    def register(self, service: ServiceStatus) -> None:
        self._services[service.name] = service

    def list_services(self) -> list[dict[str, Any]]:
        return [service.__dict__ for service in self._services.values()]

    def health(self) -> dict:
        services = self.list_services()
        online = len([s for s in services if s["status"] == "online"])
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "healthy" if online == len(services) else "degraded",
            "online": online,
            "total": len(services),
            "services": services,
        }


service_registry = ServiceRegistry()

for name, category, detail in [
    ("event_bus", "core", "In-process event bus"),
    ("settings_manager", "core", "JSON-backed platform settings"),
    ("plugin_manager", "core", "Plugin manifest registry"),
    ("workspace_manager", "core", "Workspace metadata manager"),
    ("market_data_service", "data", "Provider-based market data service"),
    ("market_data_registry", "data", "Market data provider registry"),
    ("order_manager", "trading", "Paper order manager"),
    ("scanner_engine", "scanner", "Rule graph scanner"),
    ("ai_engine", "ai", "AI placeholder engine"),
    ("backtest_engine", "strategy", "Lightweight backtesting engine"),
]:
    service_registry.register(ServiceStatus(name=name, category=category, detail=detail))
