from app.engines.scanner.ranking.ranking_engine import RankingEngine
from app.engines.scanner.scan_result import ScanResult


def test_ranking_engine_scores_indicator_results():
    result = ScanResult(
        symbol="AAPL",
        timeframe="15m",
        indicator_results={
            "SMA": {},
            "EMA": {},
            "VWMA": {},
        },
    )

    score = RankingEngine().score_result(result)

    assert score.overall == 60
    assert score.grade == "C"
    assert score.confidence == "Medium"
    assert score.breakdown.trend == 40
    assert score.breakdown.volume == 20


def test_ranking_engine_ranks_results():
    weak = ScanResult(symbol="MSFT", timeframe="15m", indicator_results={"SMA": {}})
    strong = ScanResult(
        symbol="AAPL",
        timeframe="15m",
        indicator_results={"SMA": {}, "EMA": {}, "VWMA": {}},
    )

    ranked = RankingEngine().rank([weak, strong])

    assert ranked[0].symbol == "AAPL"
    assert ranked[0].rank == 1
    assert ranked[1].rank == 2