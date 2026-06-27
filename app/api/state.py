from fastapi import APIRouter
from app.models.state import StateUpdate
from app.services.state_store import load_state, save_state
from app.core.audit import log_action

router = APIRouter(prefix="/api/state", tags=["state"])


@router.get("")
def get_state():
    return load_state()


@router.post("")
def update_state(update: StateUpdate):
    save_state(update.state)
    log_action("workspace.save", {"keys": list(update.state.keys())})
    return {"ok": True}
