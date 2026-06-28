from __future__ import annotations

from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scanner_manager import scanner_manager
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/scanner", tags=["scanner"])


@router.post("/jobs")
def create_scan_job(request: ScanRequest) -> dict:
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

    completed = scanner_manager.run_job(job_id)

    return {
        "job_id": completed.job_id,
        "status": completed.status,
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