from .indicator_registry import REGISTRY
from .indicator_cache import cache
class IndicatorEngine:
    def library(self): return REGISTRY
engine=IndicatorEngine()
