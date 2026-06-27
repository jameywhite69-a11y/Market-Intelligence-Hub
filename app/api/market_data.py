from fastapi import APIRouter, UploadFile, File
from app.engines.data.market_data_service import market_data_service
from app.engines.data.provider_registry import provider_registry
from app.models.market_data import ProviderSwitchRequest
from app.adapters.market_data.csv_adapter import IMPORT_DIR
from app.engines.data.csv_tools import validate_csv_file, write_upload, create_sample_csv
from pathlib import Path
from app.core.audit import log_action

router = APIRouter(prefix="/api/market-data", tags=["market-data"])


@router.get("/providers")
def providers():
    return {
        "active": market_data_service.active_provider(),
        "providers": provider_registry.list(),
    }


@router.post("/provider")
def switch_provider(request: ProviderSwitchRequest):
    settings = market_data_service.set_provider(request.provider)
    return {
        "ok": True,
        "active": request.provider,
        "settings": settings,
    }


@router.get("/imports")
def imports():
    return {
        "directory": str(IMPORT_DIR),
        "files": [p.name for p in IMPORT_DIR.glob("*.csv")],
        "expected_format": "time,open,high,low,close,volume",
    }


@router.get("/status")
def status():
    return {
        "active_provider": market_data_service.active_provider(),
        "providers": provider_registry.list(),
        "csv_import_dir": str(IMPORT_DIR),
    }


@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    content = await file.read()
    result = write_upload(file.filename, content)
    log_action("market_data.csv_upload", {"filename": result["filename"], "validation": result["validation"]})
    return result


@router.post("/sample-csv")
def sample_csv(payload: dict):
    symbol = payload.get("symbol", "SAMPLE")
    timeframe = payload.get("timeframe", "1D")
    bars = int(payload.get("bars", 240))
    result = create_sample_csv(symbol, timeframe, bars)
    log_action("market_data.sample_csv", {"filename": result["filename"]})
    return result


@router.get("/validate-csv/{filename}")
def validate_csv(filename: str):
    safe_name = filename.replace("\\", "_").replace("/", "_")
    return validate_csv_file(IMPORT_DIR / safe_name)


@router.get("/diagnostics")
def diagnostics():
    files = []
    for path in IMPORT_DIR.glob("*.csv"):
        files.append({
            "filename": path.name,
            "validation": validate_csv_file(path),
        })
    return {
        "active_provider": market_data_service.active_provider(),
        "import_dir": str(IMPORT_DIR),
        "csv_files": files,
        "provider_notes": provider_registry.list(),
    }
