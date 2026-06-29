from app.engines.portfolio_intelligence.opportunity_lifecycle_engine import (
    OpportunityLifecycleEngine,
)


def test_lifecycle_engine_tracks_stage_and_changes():
    engine = OpportunityLifecycleEngine()

    first = engine.evaluate(
        symbol="BTC",
        timeframe="15m",
        opportunity_score=70,
        confidence_score=65,
        decision_classification="Watch",
        recommendation="Watch Closely",
        confluence_score=75,
    )

    second = engine.evaluate(
        symbol="BTC",
        timeframe="15m",
        opportunity_score=91,
        confidence_score=84,
        decision_classification="Elite Setup",
        recommendation="Plan Trade",
        confluence_score=90,
    )

    assert first.lifecycle_stage in {"Candidate", "Detected", "Building"}
    assert second.lifecycle_stage == "A+ Setup"
    assert second.score_change > 0
    assert second.confidence_change > 0
    assert second.scans_seen == 2
    assert second.events
