REGISTRY={"SMA":{"category":"trend"},"EMA":{"category":"trend"},"WMA":{"category":"trend"},"VWAP":{"category":"trend"},"ATR":{"category":"volatility"}}
from app.engines.indicators.models import IndicatorDefinition, IndicatorParameter


class IndicatorRegistry:
    """Registry for all platform indicators.

    The registry is the single place where indicators are discovered by charts,
    scanners, backtests, AI analysis, and future plugins.
    """

    def __init__(self) -> None:
        self._indicators: dict[str, IndicatorDefinition] = {}

    def register(self, definition: IndicatorDefinition) -> None:
        key = definition.normalized_key()
        if key in self._indicators:
            raise ValueError(f"Indicator already registered: {key}")
        self._indicators[key] = definition

    def unregister(self, key: str) -> None:
        self._indicators.pop(key.strip().upper(), None)

    def get(self, key: str) -> IndicatorDefinition | None:
        return self._indicators.get(key.strip().upper())

    def list(self, enabled_only: bool = True) -> list[IndicatorDefinition]:
        indicators = list(self._indicators.values())
        if enabled_only:
            indicators = [indicator for indicator in indicators if indicator.enabled]
        return sorted(indicators, key=lambda item: (item.category, item.name))

    def as_api_response(self) -> list[dict]:
        return [indicator.model_dump() for indicator in self.list(enabled_only=True)]

    def clear(self) -> None:
        self._indicators.clear()

    def register_defaults(self) -> None:
        self.register(
            IndicatorDefinition(
                name="Exponential Moving Average",
                key="EMA",
                category="trend",
                description="Trend indicator that weights recent prices more heavily.",
                parameters=[
                    IndicatorParameter(
                        name="length",
                        parameter_type="int",
                        default=20,
                        minimum=1,
                        maximum=500,
                        description="EMA lookback length.",
                    )
                ],
            )
        )

        self.register(
            IndicatorDefinition(
                name="Simple Moving Average",
                key="SMA",
                category="trend",
                description="Average close over a fixed lookback length.",
                parameters=[
                    IndicatorParameter(
                        name="length",
                        parameter_type="int",
                        default=20,
                        minimum=1,
                        maximum=500,
                        description="SMA lookback length.",
                    )
                ],
            )
        )

        self.register(
            IndicatorDefinition(
                name="Weighted Moving Average",
                key="WMA",
                category="trend",
                description="Moving average weighted toward recent bars.",
                parameters=[
                    IndicatorParameter(
                        name="length",
                        parameter_type="int",
                        default=20,
                        minimum=1,
                        maximum=500,
                        description="WMA lookback length.",
                    )
                ],
            )
        )

        self.register(
            IndicatorDefinition(
                name="Volume Weighted Average Price",
                key="VWAP",
                category="trend",
                description="Price weighted by volume.",
                parameters=[],
            )
        )

        self.register(
            IndicatorDefinition(
                name="Average True Range",
                key="ATR",
                category="volatility",
                description="Volatility measure based on true range.",
                parameters=[
                    IndicatorParameter(
                        name="length",
                        parameter_type="int",
                        default=14,
                        minimum=1,
                        maximum=200,
                        description="ATR lookback length.",
                    )
                ],
            )
        )


indicator_registry = IndicatorRegistry()
indicator_registry.register_defaults()
import pytest

from app.engines.indicators.indicator_registry import IndicatorRegistry
from app.engines.indicators.models import IndicatorDefinition, IndicatorParameter


def test_default_registry_contains_core_indicators():
    registry = IndicatorRegistry()
    registry.register_defaults()

    keys = {indicator.key for indicator in registry.list()}

    assert "EMA" in keys
    assert "SMA" in keys
    assert "WMA" in keys
    assert "VWAP" in keys
    assert "ATR" in keys


def test_registry_rejects_duplicate_indicator_key():
    registry = IndicatorRegistry()
    definition = IndicatorDefinition(
        name="Test Indicator",
        key="TEST",
        category="custom",
        parameters=[
            IndicatorParameter(name="length", parameter_type="int", default=10),
        ],
    )

    registry.register(definition)

    with pytest.raises(ValueError):
        registry.register(definition)


def test_registry_get_is_case_insensitive():
    registry = IndicatorRegistry()
    definition = IndicatorDefinition(name="Test Indicator", key="TEST", category="custom")
    registry.register(definition)

    assert registry.get("test") is not None
    assert registry.get("TEST") is not None
    assert registry.get("TeSt") is not None


def test_registry_api_response_is_serializable():
    registry = IndicatorRegistry()
    registry.register_defaults()

    response = registry.as_api_response()

    assert isinstance(response, list)
    assert all("name" in item for item in response)
    assert all("key" in item for item in response)