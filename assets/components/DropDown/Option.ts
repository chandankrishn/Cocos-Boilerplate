import {
    _decorator,
    Component,
    Node,
    Label,
    Button,
    NodeEventType,
    Event,
    EventHandler,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Option")
export class Option extends Component {
    @property({ type: Label }) optionLabel: Label = null!;

    optionValue: string = "";

    start() {}

    initOption(optionValue: string, node: Node) {
        this.optionValue = optionValue;
        this.optionLabel.string = optionValue;
        const button = this.node.getComponent(Button);

        const clickEventHandler = new EventHandler();
        // This node is the node to which your event handler code component belongs
        clickEventHandler.target = node;
        // This is the script class name
        clickEventHandler.component = "DropDown";
        clickEventHandler.handler = "onOptionClick";
        clickEventHandler.customEventData = optionValue;

        // this.clickEvent.emit(["hello"]);

        button?.clickEvents.push(clickEventHandler);
    }
}
