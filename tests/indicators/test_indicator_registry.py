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
            IndicatorParameter(
                name="length",
                parameter_type="int",
                default=10,
            )
        ],
    )

    registry.register(definition)

    with pytest.raises(ValueError):
        registry.register(definition)


def test_registry_get_is_case_insensitive():
    registry = IndicatorRegistry()

    definition = IndicatorDefinition(
        name="Test Indicator",
        key="TEST",
        category="custom",
    )

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