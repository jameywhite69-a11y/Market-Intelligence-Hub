/*
Version 34.0 — Event Bus

Central publish/subscribe layer for the trading workstation.
*/

(function () {
    const subscribers = new Map();
    const history = [];

    function subscribe(eventName, handler) {
        if (!subscribers.has(eventName)) {
            subscribers.set(eventName, new Set());
        }

        subscribers.get(eventName).add(handler);

        return () => {
            subscribers.get(eventName)?.delete(handler);
        };
    }

    function publish(eventName, payload = {}) {
        const event = {
            name: eventName,
            payload,
            timestamp: new Date().toISOString(),
        };

        history.push(event);

        if (history.length > 250) {
            history.shift();
        }

        for (const handler of subscribers.get(eventName) || []) {
            try {
                handler(payload, event);
            } catch (error) {
                console.error(`Event handler failed for ${eventName}`, error);
            }
        }

        for (const handler of subscribers.get("*") || []) {
            try {
                handler(payload, event);
            } catch (error) {
                console.error(`Wildcard event handler failed for ${eventName}`, error);
            }
        }
    }

    function recent(limit = 50) {
        return history.slice(-limit);
    }

    window.EventBus = {
        subscribe,
        publish,
        recent,
    };
})();
