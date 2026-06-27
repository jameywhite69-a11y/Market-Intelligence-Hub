import pytest

from app.core.services import (
    ServiceAlreadyRegisteredError,
    ServiceNotFoundError,
    ServiceRegistry,
)


def test_service_registry_registers_and_resolves_service():
    registry = ServiceRegistry()
    service = object()

    registry.register("example", service)

    assert registry.resolve("example") is service


def test_service_registry_normalizes_names():
    registry = ServiceRegistry()
    service = object()

    registry.register(" Event_Bus ", service)

    assert registry.resolve("event_bus") is service
    assert registry.resolve("EVENT_BUS") is service


def test_service_registry_rejects_duplicate_registration():
    registry = ServiceRegistry()

    registry.register("example", object())

    with pytest.raises(ServiceAlreadyRegisteredError):
        registry.register("example", object())


def test_service_registry_allows_replace():
    registry = ServiceRegistry()
    first = object()
    second = object()

    registry.register("example", first)
    registry.register("example", second, replace=True)

    assert registry.resolve("example") is second


def test_service_registry_raises_for_missing_service():
    registry = ServiceRegistry()

    with pytest.raises(ServiceNotFoundError):
        registry.resolve("missing")


def test_service_registry_maybe_returns_none_for_missing_service():
    registry = ServiceRegistry()

    assert registry.maybe("missing") is None


def test_service_registry_unregisters_service():
    registry = ServiceRegistry()
    service = object()

    registry.register("example", service)
    registry.unregister("example")

    assert not registry.contains("example")


def test_service_registry_lists_names():
    registry = ServiceRegistry()

    registry.register("scanner", object())
    registry.register("event_bus", object())

    assert registry.names() == ["event_bus", "scanner"]