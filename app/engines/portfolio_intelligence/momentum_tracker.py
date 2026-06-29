from __future__ import annotations


class MomentumTracker:
    def compare(self, current_score: float, previous_score: float | None) -> str:
        if previous_score is None:
            return "new"

        delta = current_score - previous_score

        if delta >= 2:
            return "rising"
        if delta <= -2:
            return "falling"
        return "stable"
