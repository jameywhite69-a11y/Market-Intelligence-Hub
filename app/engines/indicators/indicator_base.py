from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from app.engines.indicators.models import IndicatorDefinition
from app.models.series import PriceSeries


class BaseIndicator(ABC):
    definition: IndicatorDefinition

    @abstractmethod
    def calculate(
        self,
        series: PriceSeries,
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        raise NotImplementedError