from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Callable


@dataclass
class PlatformEvent:
    topic: str
    payload: dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())


class EventBus:
    """In-process event bus for platform modules.

    This is intentionally simple for v22. Future releases can replace this
    with Redis, WebSockets, Kafka, or another streaming/event backend.
    """

    def __init__(self):
        self._subscribers: dict[str, list[Callable[[PlatformEvent], None]]] = defaultdict(list)
        self._history: list[PlatformEvent] = []

    def subscribe(self, topic: str, callback: Callable[[PlatformEvent], None]) -> None:
        self._subscribers[topic].append(callback)

    def publish(self, topic: str, payload: dict[str, Any] | None = None) -> PlatformEvent:
        event = PlatformEvent(topic=topic, payload=payload or {})
        self._history.append(event)

        for callback in self._subscribers.get(topic, []):
            callback(event)

        for callback in self._subscribers.get("*", []):
            callback(event)

        return event

    def history(self, limit: int = 100) -> list[PlatformEvent]:
        return self._history[-limit:]


event_bus = EventBus()
