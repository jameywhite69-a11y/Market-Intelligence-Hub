from __future__ import annotations

import importlib
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

def check_path(label: str, path: str) -> tuple[str, bool, str]:
    target = ROOT / path
    return label, target.exists(), path


def check_import(label: str, module: str) -> tuple[str, bool, str]:
    try:
        importlib.import_module(module)
        return label, True, module
    except Exception as exc:
        return label, False, f"{module} ({exc})"


def check_command(label: str, command: list[str]) -> tuple[str, bool, str]:
    try:
        result = subprocess.run(
            command,
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=30,
        )
        return label, result.returncode == 0, " ".join(command)
    except Exception as exc:
        return label, False, str(exc)


def print_section(title: str) -> None:
    print()
    print(title)
    print("-" * len(title))


def print_result(label: str, passed: bool, detail: str) -> None:
    status = "PASS" if passed else "FAIL"
    print(f"{label:<32} {status:<6} {detail}")


def main() -> int:
    print("Market Intelligence Hub Project Doctor")
    print("=====================================")

    checks = [
        check_path("Application package", "app"),
        check_path("Tests package", "tests"),
        check_path("Requirements file", "requirements.txt"),
        check_path("GitHub workflow", ".github/workflows/ci.yml"),
        check_path("Core package", "app/core"),
        check_path("Engines package", "app/engines"),
        check_path("Indicator package", "app/engines/indicators"),
        check_path("Scripts folder", "scripts"),
    ]

    print_section("Structure")
    for label, passed, detail in checks:
        print_result(label, passed, detail)

    import_checks = [
        check_import("FastAPI app", "app.main"),
        check_import("Event bus", "app.core.events"),
        check_import("Service registry", "app.core.services"),
        check_import("Indicator registry", "app.engines.indicators.indicator_registry"),
        check_import("Indicator cache", "app.engines.indicators.indicator_cache"),
    ]

    print_section("Imports")
    for label, passed, detail in import_checks:
        print_result(label, passed, detail)

    command_checks = [
        check_command("Python compile", [sys.executable, "-m", "compileall", "app"]),
        check_command("Pytest", [sys.executable, "-m", "pytest"]),
    ]

    print_section("Commands")
    for label, passed, detail in command_checks:
        print_result(label, passed, detail)

    all_checks = checks + import_checks + command_checks
    passed_count = sum(1 for _, passed, _ in all_checks if passed)
    total = len(all_checks)

    print_section("Summary")
    print(f"Passed: {passed_count}/{total}")

    return 0 if passed_count == total else 1


if __name__ == "__main__":
    raise SystemExit(main())