# Version 80.0 — Institutional Paper Trading Engine

## 1. Copy files

```powershell
New-Item -ItemType Directory -Force app\static\js\paper
Copy-Item payload\app\static\js\paper\paper_trading_account_v80.js app\static\js\paper\paper_trading_account_v80.js -Force
Copy-Item payload\app\static\js\paper\paper_order_ticket_v80.js app\static\js\paper\paper_order_ticket_v80.js -Force
Copy-Item payload\app\static\js\paper\paper_positions_panel_v80.js app\static\js\paper\paper_positions_panel_v80.js -Force
Copy-Item payload\app\static\css\paper_trading_engine_v80.css app\static\css\paper_trading_engine_v80.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/paper_trading_engine_v80.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near V79/V65/V66 execution panels:

```html
<section id="paperTradingAccountPanelV80"></section>
<section id="paperOrderTicketPanelV80"></section>
<section id="paperPositionsPanelV80"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V79 live opportunity scripts and before live-order/broker modules:

```html
<script src="/static/js/paper/paper_trading_account_v80.js"></script>
<script src="/static/js/paper/paper_order_ticket_v80.js"></script>
<script src="/static/js/paper/paper_positions_panel_v80.js"></script>
```

## 5. Usage

1. Start V74/V78 realtime data bus.
2. Let V79 generate live opportunities.
3. Click **Stage Top Opportunity**.
4. Click **Submit Latest Paper**.
5. Paper positions will mark-to-market from the realtime data bus.
