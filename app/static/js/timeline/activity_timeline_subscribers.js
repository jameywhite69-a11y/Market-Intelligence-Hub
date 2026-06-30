(function () {
    function registerActivityTimelineSubscribers() {
        const store = window.ActivityTimelineStore;
        const bus = window.EventBus;

        if (!store || !bus || window.__activityTimelineSubscribersRegistered) return;

        window.__activityTimelineSubscribersRegistered = true;

        bus.subscribe("scan:completed", payload => store.addEvent("scanner.completed", payload, "scanner"));
        bus.subscribe("opportunity:selected", payload => store.addEvent("opportunity.selected", payload, "workflow"));
        bus.subscribe("workspace.context.changed", payload => store.addEvent("workspace.context.changed", payload, "workspace"));
        bus.subscribe("strategy:executed", payload => store.addEvent("strategy.executed", payload, "strategy"));
        bus.subscribe("paper-order-filled", payload => store.addEvent("paper.order.filled", payload, "execution"));
        bus.subscribe("paper-order-rejected", payload => store.addEvent("paper.order.rejected", payload, "execution"));
        bus.subscribe("workspace.broker.changed", payload => store.addEvent("broker.changed", payload, "broker"));
        bus.subscribe("market-data:connected", payload => store.addEvent("market-data.connected", payload, "market-data"));
        bus.subscribe("market-data:disconnected", payload => store.addEvent("market-data.disconnected", payload, "market-data"));
        bus.subscribe("lifecycle.phase", payload => store.addEvent("lifecycle.changed", payload, "lifecycle"));

        store.addEvent("timeline.started", { detail: "Activity Timeline online." }, "timeline");
    }

    document.addEventListener("DOMContentLoaded", () => setTimeout(registerActivityTimelineSubscribers, 150));

    window.ActivityTimelineSubscribers = {
        registerActivityTimelineSubscribers,
    };
})();
