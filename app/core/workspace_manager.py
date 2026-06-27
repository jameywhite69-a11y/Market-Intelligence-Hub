from dataclasses import dataclass, field
from typing import Any


@dataclass
class WorkspaceDefinition:
    id: str
    title: str
    description: str
    default_layout: str = "standard"
    panels: list[str] = field(default_factory=list)


class WorkspaceManager:
    def __init__(self):
        self.workspaces = {
            "trading": WorkspaceDefinition(
                id="trading",
                title="Trading",
                description="Full-size charts, order ticket, checklist, AI Coach",
                panels=["charts", "order_ticket", "checklist", "ai_coach"],
            ),
            "scanner": WorkspaceDefinition(
                id="scanner",
                title="Scanner",
                description="Institutional scanner, opportunity queue, heatmaps",
                panels=["scanner", "heatmap", "live_analyzer"],
            ),
            "builder": WorkspaceDefinition(
                id="builder",
                title="Strategy Builder",
                description="Visual rules, templates, code generation",
                panels=["strategy_builder", "rule_graph", "code_generation"],
            ),
            "portfolio": WorkspaceDefinition(
                id="portfolio",
                title="Portfolio",
                description="Trade planner, staged trades, exposure, journal",
                panels=["trade_planner", "staged_trades", "exposure", "journal"],
            ),
            "ailab": WorkspaceDefinition(
                id="ailab",
                title="AI Lab",
                description="Trade review, optimization, future analytics",
                panels=["ai_coach", "broker_connections", "future_modules"],
            ),
        }

    def list_workspaces(self) -> list[dict[str, Any]]:
        return [workspace.__dict__ for workspace in self.workspaces.values()]

    def get_workspace(self, workspace_id: str) -> dict[str, Any] | None:
        workspace = self.workspaces.get(workspace_id)
        return workspace.__dict__ if workspace else None


workspace_manager = WorkspaceManager()
