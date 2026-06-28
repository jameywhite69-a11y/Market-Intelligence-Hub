class IndicatorFrameworkError(Exception):
    """Base exception for the indicator framework."""


class IndicatorNotRegisteredError(IndicatorFrameworkError, KeyError):
    """Raised when an indicator key has no registered implementation."""


class IndicatorAlreadyRegisteredError(IndicatorFrameworkError, ValueError):
    """Raised when an indicator key is registered more than once."""


class IndicatorDiscoveryError(IndicatorFrameworkError):
    """Raised when automatic indicator discovery fails."""
