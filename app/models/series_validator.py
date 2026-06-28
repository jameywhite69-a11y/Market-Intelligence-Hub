from __future__ import annotations

from dataclasses import dataclass, field

from app.models.series import PriceSeries


@dataclass
class SeriesValidationResult:
    valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


class SeriesValidator:
    """Validates PriceSeries objects before they are used by indicators."""

    def validate(self, series: PriceSeries) -> SeriesValidationResult:
        errors: list[str] = []
        warnings: list[str] = []

        lengths = {
            "open": len(series.open),
            "high": len(series.high),
            "low": len(series.low),
            "close": len(series.close),
            "volume": len(series.volume),
        }

        unique_lengths = set(lengths.values())

        if len(unique_lengths) != 1:
            errors.append(f"OHLCV series lengths do not match: {lengths}")

        if series.is_empty():
            errors.append("PriceSeries is empty.")

        if series.symbol == "":
            warnings.append("PriceSeries has no symbol.")

        if series.timeframe == "":
            warnings.append("PriceSeries has no timeframe.")

        return SeriesValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )


series_validator = SeriesValidator()