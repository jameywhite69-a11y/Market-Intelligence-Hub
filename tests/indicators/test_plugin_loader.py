from types import ModuleType
from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.indicator_factory import IndicatorFactory
from app.engines.indicators.indicator_registry import IndicatorRegistry
from app.engines.indicators.models import IndicatorDefinition
from app.engines.indicators.plugin_loader import IndicatorPluginLoader


class DummyAutoIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Dummy Auto Indicator",
        key="DUMMY_AUTO",
        category="custom",
        description="Used to test automatic plugin discovery.",
    )

    def calculate(
        self,
        bars: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        return {
            "indicator": "DUMMY_AUTO",
            "values": [42],
            "parameters": parameters or {},
        }


def test_plugin_loader_discovers_indicator_class_from_module():
    module = ModuleType("dummy_indicator_module")
    module.DummyAutoIndicator = DummyAutoIndicator

    factory = IndicatorFactory()
    registry = IndicatorRegistry()
    loader = IndicatorPluginLoader(factory=factory, registry=registry)

    discovered = loader.discover_module(module)

    assert discovered == ["DUMMY_AUTO"]
    assert factory.has("dummy_auto")
    assert registry.get("DUMMY_AUTO") is not None


def test_discovered_indicator_can_be_created_and_calculated():
    module = ModuleType("dummy_indicator_module")
    module.DummyAutoIndicator = DummyAutoIndicator

    factory = IndicatorFactory()
    registry = IndicatorRegistry()
    loader = IndicatorPluginLoader(factory=factory, registry=registry)
    loader.discover_module(module)

    indicator = factory.create("dummy_auto")
    result = indicator.calculate([], {"length": 1})

    assert result["indicator"] == "DUMMY_AUTO"
    assert result["values"] == [42]
    assert result["parameters"] == {"length": 1}
