from typing import Any
from pydantic import BaseModel


class StateUpdate(BaseModel):
    state: dict[str, Any]
