import { _decorator, Component, Node } from "cc";
import { ISignal } from "../../eventSystem/ISignal";
import { Signal } from "../../eventSystem/Signal";

const { ccclass } = _decorator;

@ccclass("UIButton")
export class UIButton extends Component {
    private interactedEvent = new Signal<UIButton>();

    public start(): void {
        this.node.on(Node.EventType.TOUCH_START, this.interact, this);
    }

    public get InteractedEvent(): ISignal<UIButton> {
        return this.interactedEvent;
    }

    private interact(): void {
        console.log("interact");
        this.interactedEvent.trigger(this);
    }
}
