from __future__ import annotations

from uuid import uuid4

from app.engines.scanner.scan_job import ScanJob
from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scan_result import ScanResult


class ScannerManager:
    """Coordinates scanner jobs."""

    def __init__(self) -> None:
        self._jobs: dict[str, ScanJob] = {}

    def create_job(self, request: ScanRequest) -> ScanJob:
        job = ScanJob(
            request=request,
            job_id=str(uuid4()),
        )
        self._jobs[job.job_id] = job
        return job

    def get_job(self, job_id: str) -> ScanJob | None:
        return self._jobs.get(job_id)

    def list_jobs(self) -> list[ScanJob]:
        return list(self._jobs.values())

    def run_job(self, job_id: str) -> ScanJob:
        job = self._jobs[job_id]
        job.mark_running()

        results: list[ScanResult] = []

        for symbol in job.request.normalized_symbols():
            for timeframe in job.request.timeframes:
                results.append(
                    ScanResult(
                        symbol=symbol,
                        timeframe=timeframe,
                    )
                )

        job.results = results
        job.mark_complete()
        return job


scanner_manager = ScannerManager()