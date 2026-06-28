from app.engines.scanner.scan_request import ScanRequest
from app.engines.scanner.scan_result import ScanResult
from app.engines.scanner.scanner_manager import ScannerManager


def test_scan_request_normalizes_symbols_and_indicators():
    request = ScanRequest(
        symbols=[" aapl ", "msft"],
        indicators=[" sma ", "ema"],
    )

    assert request.normalized_symbols() == ["AAPL", "MSFT"]
    assert request.normalized_indicators() == ["SMA", "EMA"]


def test_scan_result_key():
    result = ScanResult(symbol="aapl", timeframe="15m")

    assert result.key() == "AAPL:15m"


def test_scanner_manager_creates_job():
    manager = ScannerManager()
    request = ScanRequest(symbols=["AAPL"], timeframes=["15m"])

    job = manager.create_job(request)

    assert job.job_id
    assert job.status == "pending"
    assert manager.get_job(job.job_id) is job


def test_scanner_manager_runs_job():
    manager = ScannerManager()
    request = ScanRequest(
        symbols=["AAPL", "MSFT"],
        timeframes=["15m", "1h"],
    )

    job = manager.create_job(request)
    completed = manager.run_job(job.job_id)

    assert completed.status == "completed"
    assert len(completed.results) == 4
    assert completed.results[0].symbol == "AAPL"