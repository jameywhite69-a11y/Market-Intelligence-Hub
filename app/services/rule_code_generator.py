from app.models.rule import StrategyRuleGraph


def graph_to_json_text(graph: StrategyRuleGraph) -> str:
    return graph.model_dump_json(indent=2)


def _pine_condition(rule, idx: int) -> str:
    var_name = f"rule{idx}"
    value = rule.value

    if rule.rule_type == "EMA":
        return f"{var_name} = ema29 > ema54"
    if rule.rule_type == "ADX":
        return f"{var_name} = adx > {value or 16}"
    if rule.rule_type == "RVOL":
        return f"{var_name} = rvol > {value or 1.5}"
    if rule.rule_type == "RSI":
        return f"{var_name} = ta.rsi(close, 14) > {value or 55}"
    if rule.rule_type == "VWAP":
        return f"{var_name} = close > vwapValue"
    if rule.rule_type == "CANDLE":
        return f"{var_name} = close > open"
    return f"{var_name} = low <= ema29 and close > ema29"


def graph_to_pine(graph: StrategyRuleGraph) -> str:
    enabled = [r for r in graph.rules if r.enabled]
    glue = " and " if graph.logic == "AND" else " or "
    safe_name = graph.name.replace('"', "'")

    lines = [
        "//@version=6",
        f'strategy("{safe_name}", overlay=true, initial_capital=10000, pyramiding=0, process_orders_on_close=true)',
        "",
        "// Generated from Market Intelligence Hub v19 Phase 2.2 Rule Graph",
        f"// Logic: {graph.logic}",
        f"// Direction: {graph.direction}",
        f"// Timeframe: {graph.timeframe}",
        "",
        "ema29 = ta.ema(close, 29)",
        "ema54 = ta.ema(close, 54)",
        "[diPlus, diMinus, adx] = ta.dmi(14, 14)",
        "rvol = volume / ta.sma(volume, 20)",
        "vwapValue = ta.vwap(hlc3)",
        "",
    ]

    names = []
    for i, rule in enumerate(enabled, start=1):
        lines.append("// " + rule.label)
        lines.append(_pine_condition(rule, i))
        names.append(f"rule{i}")

    lines.append("")
    lines.append("longSignal = " + (glue.join(names) if names else "false"))
    lines += [
        "",
        "if longSignal",
        '    strategy.entry("Long", strategy.long)',
        "",
        "if strategy.position_size > 0 and close < ema54",
        '    strategy.close("Long")',
        "",
        'plot(ema29, "EMA29", color=color.yellow)',
        'plot(ema54, "EMA54", color=color.aqua)',
        'plot(vwapValue, "VWAP", color=color.fuchsia)',
        'alertcondition(longSignal, "Rule Graph Long", "Rule graph long signal")',
    ]
    return "\n".join(lines)


def graph_to_easylanguage(graph: StrategyRuleGraph) -> str:
    glue = " and " if graph.logic == "AND" else " or "
    checks = []
    for rule in graph.rules:
        if not rule.enabled:
            continue
        if rule.rule_type == "EMA":
            checks.append("EMAFast > EMASlow")
        elif rule.rule_type == "ADX":
            checks.append(f"ADXValue > {rule.value or 16}")
        elif rule.rule_type == "RVOL":
            checks.append(f"RVOL > {rule.value or 1.5}")
        elif rule.rule_type == "RSI":
            checks.append(f"RSI(Close, 14) > {rule.value or 55}")
        elif rule.rule_type == "CANDLE":
            checks.append("Close > Open")
        elif rule.rule_type == "VWAP":
            checks.append("Close > VWAP")
        else:
            checks.append("Low <= EMAFast and Close > EMAFast")

    condition = glue.join(checks) if checks else "False"

    return "\n".join([
        "{ Generated from Market Intelligence Hub v19 Phase 2.2 Rule Graph }",
        f"{{ Strategy: {graph.name} }}",
        f"{{ Logic: {graph.logic} }}",
        "",
        "Inputs: FastEMA(29), SlowEMA(54), ADXLen(14), RVOLLen(20);",
        "Vars: EMAFast(0), EMASlow(0), ADXValue(0), RVOL(0), LongSignal(False);",
        "",
        "EMAFast = XAverage(Close, FastEMA);",
        "EMASlow = XAverage(Close, SlowEMA);",
        "ADXValue = ADX(ADXLen);",
        "RVOL = Volume / Average(Volume, RVOLLen);",
        "",
        f"LongSignal = {condition};",
        "",
        "If LongSignal Then",
        '    Buy ("RuleGraphL") Next Bar at Market;',
        "",
        "If MarketPosition = 1 and Close < EMASlow Then",
        '    Sell ("RuleGraphLX") Next Bar at Market;',
    ])


def graph_to_python(graph: StrategyRuleGraph) -> str:
    reducer = "all" if graph.logic == "AND" else "any"
    return "\n".join([
        '"""',
        "Generated from Market Intelligence Hub v19 Phase 2.2 Rule Graph",
        f"Strategy: {graph.name}",
        f"Logic: {graph.logic}",
        '"""',
        "",
        "def evaluate_row(row: dict) -> bool:",
        "    checks = []",
        "    checks.append(row.get('ema29', 0) > row.get('ema54', 0))",
        "    checks.append(row.get('adx', 0) > 16)",
        "    checks.append(row.get('rvol', 0) > 1.5)",
        "    checks.append(row.get('close', 0) > row.get('ema29', 0))",
        f"    return {reducer}(checks)",
    ])
