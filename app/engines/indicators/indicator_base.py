from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from app.engines.indicators.models import IndicatorDefinition


class BaseIndicator(ABC):
    definition: IndicatorDefinition

    @abstractmethod
    def calculate(self, bars: list[dict[str, Any]], parameters: dict[str, Any] | None = None) -> dict[str, Any]:
        raise NotImplementedError
