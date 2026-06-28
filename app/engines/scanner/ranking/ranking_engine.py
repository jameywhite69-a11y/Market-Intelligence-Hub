from __future__ import annotations

from app.engines.scanner.ranking.ranking_models import RankingScore, ScoreBreakdown
from app.engines.scanner.scan_result import ScanResult


class RankingEngine:
    """Scores and ranks scanner results."""

    def score_result(self, result: ScanResult) -> RankingScore:
        breakdown = ScoreBreakdown()
        reasons: list[str] = []

        indicator_keys = set(result.indicator_results.keys())

        if "SMA" in indicator_keys:
            breakdown.trend += 20
            reasons.append("SMA result present.")

        if "EMA" in indicator_keys:
            breakdown.trend += 20
            reasons.append("EMA result present.")

        if "VWMA" in indicator_keys:
            breakdown.volume += 20
            reasons.append("VWMA result present.")

        overall = min(
            100.0,
            breakdown.trend
            + breakdown.momentum
            + breakdown.volume
            + breakdown.volatility
            + breakdown.structure,
        )

        return RankingScore(
            overall=overall,
            grade=self._grade(overall),
            confidence=self._confidence(overall),
            breakdown=breakdown,
            reasons=reasons,
        )

    def rank(self, results: list[ScanResult]) -> list[ScanResult]:
        scored: list[tuple[ScanResult, RankingScore]] = []

        for result in results:
            score = self.score_result(result)
            result.score = score.overall
            result.tags = [score.grade, score.confidence]
            scored.append((result, score))

        scored.sort(key=lambda item: item[1].overall, reverse=True)

        ranked_results = [item[0] for item in scored]

        for index, result in enumerate(ranked_results, start=1):
            result.rank = index

        return ranked_results

    def _grade(self, score: float) -> str:
        if score >= 90:
            return "A+"
        if score >= 80:
            return "A"
        if score >= 70:
            return "B"
        if score >= 60:
            return "C"
        return "D"

    def _confidence(self, score: float) -> str:
        if score >= 80:
            return "High"
        if score >= 60:
            return "Medium"
        return "Low"


ranking_engine = RankingEngine()