from app.models.strategy import StrategyDefinition
from app.services.pine_generator import generate_pine
from app.services.easylanguage_generator import generate_easylanguage
from app.services.python_generator import generate_python


def generate_strategy_code(strategy: StrategyDefinition) -> dict:
    return {
        "definition": strategy.model_dump(),
        "pine": generate_pine(strategy) if strategy.generate_pine else "",
        "easylanguage": generate_easylanguage(strategy) if strategy.generate_easylanguage else "",
        "python": generate_python(strategy) if strategy.generate_python else "",
    }
