from typing import Any

from app.engines.indicators.indicator_base import BaseIndicator
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


def test_base_indicator_contract():
    indicator = DummyIndicator()

    result = indicator.calculate([], {})

    assert indicator.definition.key == "DUMMY"
    assert result["values"] == [1, 2, 3]