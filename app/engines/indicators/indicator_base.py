from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from app.engines.indicators.models import IndicatorDefinition


class BaseIndicator(ABC):
    """Base class for all indicator implementations."""

    definition: IndicatorDefinition

    @abstractmethod
    def calculate(
        self,
        bars: list[dict[str, Any]],
        parameters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Calculate indicator values from OHLCV bars."""
        raise NotImplementedError