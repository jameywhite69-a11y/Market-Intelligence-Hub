from pydantic import BaseModel, Field


class MarketDataProviderConfig(BaseModel):
    provider: str = "demo"
    enabled: bool = True
    api_key: str | None = None
    api_secret: str | None = None
    base_url: str | None = None
    notes: str = ""


class ProviderSwitchRequest(BaseModel):
    provider: str


class CsvImportRequest(BaseModel):
    symbol: str
    timeframe: str = "1D"
    filename: str
