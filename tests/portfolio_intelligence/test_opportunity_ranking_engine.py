from app.engines.portfolio_intelligence.opportunity_ranking_engine import opportunity_ranking_engine


def test_opportunity_ranking_engine_ranks_and_allocates():
    snapshot = opportunity_ranking_engine.rank(
        opportunities=[
            {
                "symbol": "AAA",
                "timeframe": "15m",
                "decision": {"decision_score": 90, "classification": "Elite Setup", "recommendation": "Plan Trade"},
                "confidence": {"confidence_score": 85},
                "strategy_score": {"overall_score": 80},
                "trade_plan": {"expected_r_multiple": 3},
            },
            {
                "symbol": "BBB",
                "timeframe": "15m",
                "decision": {"decision_score": 70, "classification": "Watch", "recommendation": "Watch Closely"},
                "confidence": {"confidence_score": 65},
                "strategy_score": {"overall_score": 60},
                "trade_plan": {"expected_r_multiple": 2},
            },
        ],
        previous_scores={},
    )

    assert snapshot.top_opportunity is not None
    assert snapshot.top_opportunity.symbol == "AAA"
    assert len(snapshot.ranked_opportunities) == 2
    assert sum(item.allocation_percent for item in snapshot.ranked_opportunities) > 99
