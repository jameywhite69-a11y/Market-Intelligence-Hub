class IndicatorCache:
    def __init__(self): self._c={}
    def get(self,k): return self._c.get(k)
    def set(self,k,v): self._c[k]=v
cache=IndicatorCache()
