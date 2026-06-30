from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.risk.engine import institutional_risk_engine

router = APIRouter(prefix="/api/risk", tags=["risk"])


class RiskAssessmentRequest(BaseModel):
    context: dict


@router.post("/assess")
def assess_risk(request: RiskAssessmentRequest) -> dict:
    return institutional_risk_engine.assess(request.context)
