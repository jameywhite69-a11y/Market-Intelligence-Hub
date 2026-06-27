from typing import Any

import pytest

from app.engines.indicators.indicator_base import BaseIndicator
from app.engines.indicators.indicator_factory import IndicatorFactory
from app.engines.indicators.models import IndicatorDefinition


class DummyIndicator(BaseIndicator):
    definition = IndicatorDefinition(
        name="Dummy",
        key="DUMMY",
        category="custom",
    )

    def calculate(
        self,
        bars: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        return {"values": [1, 2, 3]}


def test_factory_registers_and_creates_indicator():
    factory = IndicatorFactory()
    factory.register("DUMMY", DummyIndicator)

    indicator = factory.create("dummy")

    assert isinstance(indicator, DummyIndicator)


def test_factory_rejects_duplicate_registration():
    factory = IndicatorFactory()
    factory.register("DUMMY", DummyIndicator)

    with pytest.raises(ValueError):
        factory.register("dummy", DummyIndicator)


def test_factory_raises_for_missing_indicator():
    factory = IndicatorFactory()

    with pytest.raises(KeyError):
        factory.create("missing")


def test_factory_reports_registered_keys():
    factory = IndicatorFactory()
    factory.register("DUMMY", DummyIndicator)

    assert factory.has("dummy")
    assert factory.keys() == ["DUMMY"]


def test_factory_clear_removes_registered_indicators():
    factory = IndicatorFactory()
    factory.register("DUMMY", DummyIndicator)

    factory.clear()

    assert not factory.has("DUMMY")