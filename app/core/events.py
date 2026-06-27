from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from threading import RLock
from typing import Any, Callable


@dataclass(frozen=True)
class PlatformEvent:
    topic: str
    payload: dict[str, Any] = field(default_factory=dict)
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


EventHandler = Callable[[PlatformEvent], None]


class EventBus:
    """Thread-safe in-process event bus for platform modules."""

    def __init__(self) -> None:
        self._subscribers: dict[str, list[EventHandler]] = defaultdict(list)
        self._history: list[PlatformEvent] = []
        self._lock = RLock()

    def subscribe(self, topic: str, handler: EventHandler) -> None:
        with self._lock:
            self._subscribers[topic].append(handler)

    def publish(
        self,
        topic: str,
        payload: dict[str, Any] | None = None,
    ) -> PlatformEvent:
        event = PlatformEvent(topic=topic, payload=payload or {})

        with self._lock:
            self._history.append(event)
            handlers = list(self._subscribers.get(topic, []))
            wildcard_handlers = list(self._subscribers.get("*", []))

        for handler in handlers + wildcard_handlers:
            handler(event)

        return event

    def history(self, limit: int = 100) -> list[PlatformEvent]:
        with self._lock:
            return self._history[-limit:]

    def clear(self) -> None:
        with self._lock:
            self._subscribers.clear()
            self._history.clear()


event_bus = EventBus()