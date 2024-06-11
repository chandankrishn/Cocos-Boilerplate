import { _decorator, Component, Material, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HSLColorChange')
export class HSLColorChange extends Component {

    protected material: Material = null!;

    colorNum: number = 0;
    onLoad() {
        this.material = this.node.getComponent(Sprite)?.customMaterial!
    }

    update(deltaTime: number) {
        this.material.setProperty('u_dH', this.colorNum);
        this.colorNum += 1
        if (this.colorNum > 300) {
            this.colorNum = 0
        }
    }
}

