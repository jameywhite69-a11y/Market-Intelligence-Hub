from __future__ import annotations

import importlib
import inspect
import pkgutil
from types import ModuleType

from app.engines.indicators.exceptions import IndicatorDiscoveryError
from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.indicator_factory import IndicatorFactory, indicator_factory
from app.engines.indicators.indicator_registry import IndicatorRegistry, indicator_registry


class IndicatorPluginLoader:
    """Discovers and registers indicator classes."""

    def __init__(
        self,
        factory: IndicatorFactory | None = None,
        registry: IndicatorRegistry | None = None,
    ) -> None:
        self.factory = factory or indicator_factory
        self.registry = registry or indicator_registry

    def discover_module(self, module: ModuleType, *, replace: bool = False) -> list[str]:
        registered: list[str] = []

        for _, obj in inspect.getmembers(module, inspect.isclass):
            if obj is BaseIndicator:
                continue
            if not issubclass(obj, BaseIndicator):
                continue

            definition = getattr(obj, "definition", None)
            if definition is None:
                continue

            key = definition.normalized_key()
            self.factory.register(key, obj, replace=replace)

            if self.registry.get(key) is None:
                self.registry.register(definition)

            registered.append(key)

        return sorted(set(registered))

    def discover_package(self, package_name: str, *, replace: bool = False) -> list[str]:
        try:
            package = importlib.import_module(package_name)
        except Exception as exc:
            raise IndicatorDiscoveryError(f"Could not import package {package_name}: {exc}") from exc

        if not hasattr(package, "__path__"):
            return self.discover_module(package, replace=replace)

        discovered: list[str] = []
        for module_info in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
            module = importlib.import_module(module_info.name)
            discovered.extend(self.discover_module(module, replace=replace))

        return sorted(set(discovered))


plugin_loader = IndicatorPluginLoader()
