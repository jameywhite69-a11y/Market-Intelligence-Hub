from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_decision.engine import ai_decision_engine

router = APIRouter(prefix="/api/ai-decision", tags=["ai-decision"])

class AIDecisionRequest(BaseModel):
    context: dict

@router.post("/analyze")
def analyze_decision(request: AIDecisionRequest) -> dict:
    return ai_decision_engine.analyze(request.context)
