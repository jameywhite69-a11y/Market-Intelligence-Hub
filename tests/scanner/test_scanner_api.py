from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_scanner_api_rejects_empty_symbols():
    response = client.post(
        "/api/scanner/jobs",
        json={
            "symbols": [],
            "timeframes": ["15m"],
            "indicators": ["SMA"],
            "parameters": {},
        },
    )

    assert response.status_code == 400


def test_scanner_api_creates_and_runs_job():
    create_response = client.post(
        "/api/scanner/jobs",
        json={
            "symbols": ["AAPL"],
            "timeframes": ["15m"],
            "indicators": ["SMA", "EMA", "VWMA"],
            "parameters": {
                "SMA": {"length": 20},
                "EMA": {"length": 20},
                "VWMA": {"length": 20},
            },
        },
    )

    assert create_response.status_code == 200

    job_id = create_response.json()["job_id"]

    run_response = client.post(f"/api/scanner/jobs/{job_id}/run")

    assert run_response.status_code == 200

    payload = run_response.json()

    assert payload["status"] == "completed"
    assert payload["results"]
    assert payload["diagnostics"]["result_count"] == len(payload["results"])
