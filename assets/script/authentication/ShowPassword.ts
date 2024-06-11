import { _decorator, Component, EditBox, log, Node, Toggle, ToggleComponent } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("ShowPassword")
@requireComponent(Toggle)
export class ShowPassword extends Component {
    @property(EditBox)
    editbox: EditBox = null!;

    start() {
        this.node.on("toggle", this.callback, this);
        this.changeVisibility(this.node.getComponent(Toggle)?.isChecked!);
    }

    callback(toggle: ToggleComponent) {
        this.changeVisibility(toggle.isChecked);
    }

    changeVisibility(isVisible: boolean) {
        console.log("editBox data ", this.node.getComponent(Toggle));

        this.editbox.inputFlag = isVisible ? EditBox.InputFlag.PASSWORD : EditBox.InputFlag.DEFAULT;
    }
}
