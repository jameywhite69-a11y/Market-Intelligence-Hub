# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "production_broker_gateway_v108.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "productionBrokerGatewayPanelV108|brokerConnectionWizardPanelV108|brokerGatewayHealthPanelV108"
Select-String app\templates\workstation\_script_loader.html -Pattern "production_broker_gateway_v108|broker_connection_wizard_v108|broker_gateway_health_v108"
```

Browser:

```javascript
typeof ProductionBrokerGatewayV108
typeof BrokerConnectionWizardV108
typeof BrokerGatewayHealthV108
ProductionBrokerGatewayV108.readiness()
ProductionBrokerGatewayV108.connectionTest()
BrokerGatewayHealthV108.check()
```
