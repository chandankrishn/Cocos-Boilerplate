import { _decorator, Component, EditBox, Node, Toggle, ToggleComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShowPassword')
export class ShowPassword extends Component {

    @property(EditBox)
    editbox: EditBox = null!;

    start() {
        this.node.on('toggle', this.callback, this);
        this.changeVisibility(this.node.getComponent(Toggle)?.isChecked!)

    }

    callback(toggle: ToggleComponent) {
        this.changeVisibility(toggle.isChecked)

    }

    changeVisibility(isVisible: boolean) {
        this.editbox.inputFlag = isVisible ? EditBox.InputFlag.DEFAULT : EditBox.InputFlag.PASSWORD
    }

}

