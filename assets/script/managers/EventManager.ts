import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EventManager")
export class EventManager extends Component {
    /**
     * Ordinary event container
     */
    private static events: Map<string, Subscription[]> = new Map<
        string,
        Subscription[]
    >();

    /**
     * 一Secondary event container
     */
    private static onceEvents: Map<string, Subscription[]> = new Map<
        string,
        Subscription[]
    >();

    /**
     * Registration issue
     * @param name Incident name
     * @param callback Call back
     * @param target Target
     */
    public static on(name: string, callback: Function, target?: any) {
        const events = this.events;
        if (!events.has(name)) {
            events.set(name, [{ callback, target }]);
            return;
        }
        events?.get(name)?.push({ callback, target });
    }

    /**
     * Registration event (one -time)
     * @param nameIncident name
     * @param callback Call back
     * @param target Target
     */
    public static once(name: string, callback: Function, target?: any) {
        const events = this.onceEvents;
        if (!events.has(name)) {
            events.set(name, [{ callback, target }]);
            return;
        }
        events?.get(name)?.push({ callback, target });
    }

    /**
     * Cancel registration event
     * @param Name event name
     * @param callback Call back
     * @param target Target
     */
    public static off(name: string, callback: Function, target?: any) {
        // Ordinary incident
        const event = this.events.get(name);
        if (event) {
            for (let i = 0, l = event.length; i < l; i++) {
                if (this.compare(event[i], callback, target)) {
                    event.splice(i, 1);
                    if (event.length === 0) {
                        this.events.delete(name);
                    }
                    break;
                }
            }
        }
        // 一Secondary event
        const onceEvent = this.onceEvents.get(name);
        if (onceEvent) {
            for (let i = 0, l = onceEvent.length; i < l; i++) {
                if (this.compare(onceEvent[i], callback, target)) {
                    onceEvent.splice(i, 1);
                    if (onceEvent.length === 0) {
                        this.onceEvents.delete(name);
                    }
                    break;
                }
            }
        }
    }

    /**
     *Send an event through the event name
     * @param name Incident name
     * @param args parameter
     */
    public static emit(name: string, ...args: any[]) {
        // Ordinary incident
        const event = this.events.get(name);
        if (event) {
            for (let i = 0; i < event.length; i++) {
                const { callback, target } = event[i];
                callback.apply(target, args);
            }
        }
        // 一Secondary event
        const onceEvent = this.onceEvents.get(name);
        if (onceEvent) {
            for (let i = 0; i < onceEvent.length; i++) {
                const { callback, target } = onceEvent[i];
                callback.apply(target, args);
            }
            this.onceEvents.delete(name);
        }
    }

    /**
     * Remove the specified event
     * @param name Incident name
     */
    public static remove(name: string) {
        // Ordinary incident
        if (this.events.has(name)) {
            this.events.delete(name);
        }
        // 一Secondary event
        if (this.onceEvents.has(name)) {
            this.onceEvents.delete(name);
        }
    }

    /**
     * Remove all events
     */
    public static removeAll() {
        // Ordinary incident
        this.events.clear();
        // 一Secondary event
        this.onceEvents.clear();
    }

    /**
     * 对比
     * @param subscription subscription
     * @param inCallback Call back
     * @param inTarget Target
     */
    private static compare(
        subscription: Subscription,
        inCallback: Function,
        inTarget: any
    ) {
        const { callback, target } = subscription;
        return (
            target === inTarget &&
            (callback === inCallback ||
                callback.toString() === inCallback.toString())
        );
    }
}

/** subscription */
interface Subscription {
    /** Call back */
    callback: Function;
    /** Target */
    target: any;
}
