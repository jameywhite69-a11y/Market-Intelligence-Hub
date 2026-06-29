from __future__ import annotations

from uuid import uuid4

from app.adapters.market_data.market_data_provider import MarketDataProvider
from app.adapters.market_data.provider_registry import market_data_provider_registry
from app.engines.scanner.indicator_pipeline import IndicatorPipeline
from app.engines.scanner.ranking.ranking_engine import RankingEngine
from app.engines.scanner.scan_job import ScanJob
from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scan_result import ScanResult


class ScannerManager:
    """Coordinates scanner jobs."""

    def __init__(
        self,
        indicator_pipeline: IndicatorPipeline | None = None,
        market_data_provider: MarketDataProvider | None = None,
        ranking_engine: RankingEngine | None = None,
    ) -> None:
        self._jobs: dict[str, ScanJob] = {}
        self.indicator_pipeline = indicator_pipeline or IndicatorPipeline()
        self.market_data_provider = (
            market_data_provider or market_data_provider_registry.get("demo")
        )
        self.ranking_engine = ranking_engine or RankingEngine()

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
                series = self.market_data_provider.get_series(
                    symbol=symbol,
                    timeframe=timeframe,
                    limit=100,
                )

                indicator_results = self.indicator_pipeline.run(
                    series=series,
                    indicators=job.request.normalized_indicators(),
                    parameters=job.request.parameters,
                )

                results.append(
                    ScanResult(
                        symbol=symbol,
                        timeframe=timeframe,
                        indicator_results=indicator_results,
                    )
                )

        job.results = self.ranking_engine.rank(results)
        job.mark_complete()
        return job


scanner_manager = ScannerManager()