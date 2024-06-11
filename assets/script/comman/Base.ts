import { _decorator, Component } from "cc";
import { ResourcesManager } from "../managers/ResourcesManager";
const { ccclass, property } = _decorator;

@ccclass("Base")
export class Base extends Component {
    start() {}

    protected onDestroy(): void {
        ResourcesManager.releaseNodeCache();
    }

    update(deltaTime: number) {}
}
