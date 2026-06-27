from dataclasses import dataclass
@dataclass
class IndicatorRequest:
    symbol:str
    timeframe:str
