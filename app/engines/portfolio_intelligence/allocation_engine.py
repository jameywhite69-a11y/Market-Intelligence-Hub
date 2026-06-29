from __future__ import annotations


class AllocationEngine:
    def allocate(self, scores: list[float], max_total_percent: float = 100.0) -> list[float]:
        if not scores:
            return []

        positive_scores = [max(0.0, score) for score in scores]
        total = sum(positive_scores)

        if total <= 0:
            equal = max_total_percent / len(scores)
            return [round(equal, 2) for _ in scores]

        return [
            round((score / total) * max_total_percent, 2)
            for score in positive_scores
        ]
