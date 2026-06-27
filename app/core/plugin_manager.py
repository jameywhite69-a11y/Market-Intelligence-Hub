from dataclasses import dataclass, field
from typing import Any


@dataclass
class PluginManifest:
    name: str
    category: str
    version: str = "1.0"
    enabled: bool = True
    description: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)


class PluginManager:
    def __init__(self):
        self._plugins: dict[str, PluginManifest] = {}

    def register(self, manifest: PluginManifest) -> None:
        self._plugins[manifest.name] = manifest

    def list_plugins(self) -> list[dict[str, Any]]:
        return [plugin.__dict__ for plugin in self._plugins.values()]

    def bootstrap_defaults(self) -> None:
        defaults = [
            PluginManifest("Trading Workspace", "workspace", "22.0", True, "Large chart-focused trading workspace"),
            PluginManifest("Institutional Scanner", "scanner", "22.0", True, "Rule-graph-driven opportunity scanner"),
            PluginManifest("Visual Strategy Builder", "strategy", "22.0", True, "Rule graph and code generation"),
            PluginManifest("Paper Broker", "broker", "22.0", True, "Demo-safe execution adapter"),
            PluginManifest("Demo Market Data", "data", "22.0", True, "Simulated OHLCV and quotes"),
        ]
        for plugin in defaults:
            self.register(plugin)


plugin_manager = PluginManager()
plugin_manager.bootstrap_defaults()
