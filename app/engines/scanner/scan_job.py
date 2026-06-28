from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime

from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scan_result import ScanResult


@dataclass
class ScanJob:
    """Represents a single scanner execution."""

    request: ScanRequest

    job_id: str

    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    status: str = "pending"

    results: list[ScanResult] = field(default_factory=list)

    def mark_running(self) -> None:
        self.status = "running"

    def mark_complete(self) -> None:
        self.status = "completed"

    def mark_failed(self) -> None:
        self.status = "failed"