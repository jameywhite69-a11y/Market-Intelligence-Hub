def sma(vals,n):
 return sum(vals[-n:])/min(len(vals),n) if vals else None
