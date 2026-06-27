from __future__ import annotations

from threading import RLock
from typing import Any


class ServiceNotFoundError(KeyError):
    """Raised when a requested service is not registered."""


class ServiceAlreadyRegisteredError(ValueError):
    """Raised when trying to register a service name twice."""


class ServiceRegistry:
    """Thread-safe service registry for dependency injection.

    This registry provides a single source of truth for shared platform services.
    Examples:
    - event_bus
    - indicator_engine
    - scanner_engine
    - broker_adapter
    - market_data_service
    """

    def __init__(self) -> None:
        self._services: dict[str, Any] = {}
        self._lock = RLock()

    def register(self, name: str, service: Any, *, replace: bool = False) -> None:
        key = self._normalize_name(name)

        with self._lock:
            if key in self._services and not replace:
                raise ServiceAlreadyRegisteredError(f"Service already registered: {key}")

            self._services[key] = service

    def resolve(self, name: str) -> Any:
        key = self._normalize_name(name)

        with self._lock:
            if key not in self._services:
                raise ServiceNotFoundError(f"Service not registered: {key}")

            return self._services[key]

    def maybe(self, name: str) -> Any | None:
        key = self._normalize_name(name)

        with self._lock:
            return self._services.get(key)

    def unregister(self, name: str) -> None:
        key = self._normalize_name(name)

        with self._lock:
            self._services.pop(key, None)

    def contains(self, name: str) -> bool:
        key = self._normalize_name(name)

        with self._lock:
            return key in self._services

    def names(self) -> list[str]:
        with self._lock:
            return sorted(self._services.keys())

    def clear(self) -> None:
        with self._lock:
            self._services.clear()

    @staticmethod
    def _normalize_name(name: str) -> str:
        return name.strip().lower()


services = ServiceRegistry()