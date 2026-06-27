from pydantic import BaseModel


class PlatformConfig(BaseModel):
    app_name: str = "Market Intelligence Hub"
    version: str = "25.0.0"
    environment: str = "development"
    market_data_provider: str = "demo"
    broker_provider: str = "paper"
    log_level: str = "INFO"


config = PlatformConfig()