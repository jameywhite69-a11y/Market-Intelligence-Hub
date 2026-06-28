from __future__ import annotations

from time import perf_counter

from fastapi import APIRouter, HTTPException

from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scanner_manager import scanner_manager

router = APIRouter(prefix="/api/scanner", tags=["scanner"])


def _validate_request(request: ScanRequest) -> None:
    if not request.normalized_symbols():
        raise HTTPException(status_code=400, detail="At least one symbol is required.")

    if not request.timeframes:
        raise HTTPException(status_code=400, detail="At least one timeframe is required.")

    if not request.normalized_indicators():
        raise HTTPException(status_code=400, detail="At least one indicator is required.")


@router.post("/jobs")
def create_scan_job(request: ScanRequest) -> dict:
    _validate_request(request)

    job = scanner_manager.create_job(request)
    return {
        "job_id": job.job_id,
        "status": job.status,
    }


@router.post("/jobs/{job_id}/run")
def run_scan_job(job_id: str) -> dict:
    job = scanner_manager.get_job(job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Scan job not found.")

    started = perf_counter()

    try:
        completed = scanner_manager.run_job(job_id)
    except KeyError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    elapsed_ms = round((perf_counter() - started) * 1000, 2)

    return {
        "job_id": completed.job_id,
        "status": completed.status,
        "diagnostics": {
            "execution_ms": elapsed_ms,
            "symbols": completed.request.normalized_symbols(),
            "timeframes": completed.request.timeframes,
            "indicators": completed.request.normalized_indicators(),
            "result_count": len(completed.results),
            "provider": "demo",
        },
        "results": [result.model_dump() for result in completed.results],
    }


@router.get("/jobs/{job_id}")
def get_scan_job(job_id: str) -> dict:
    job = scanner_manager.get_job(job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Scan job not found.")

    return {
        "job_id": job.job_id,
        "status": job.status,
        "results": [result.model_dump() for result in job.results],
    }
