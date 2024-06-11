import { _decorator, Component, director, Node } from "cc";
import { SnackBar } from "./SnackBar";
import { GameManager } from "../managers/GameManager";
import { PopupManager } from "../managers/PopupManager";
import { CircularLoader, LoaderType } from "../../components/loader/CircularLoader";
const { ccclass, property } = _decorator;

@ccclass("PersistNode")
export class PersistNode extends Component {

    @property({ type: Node })
    snakBar: Node = null!;
    @property({ type: Node }) loader: Node = null!;
    @property({ type: Node }) popUpContainer: Node = null!;

    start() {
        director.addPersistRootNode(this.node);
        GameManager.Instance.PersistNodeRef = this;
        PopupManager.container = this.popUpContainer;
        setTimeout(() => {
            this.hideLoader();
            this.showSnackBar("INITIAL MESSAGE", 3, 2)
        }, 2000);
    }

    showSnackBar(message: string, duration: number, screenTime: number) {
        this.snakBar!.getComponent(SnackBar)!.showSnackBar(message, duration, screenTime);
    }

    showLoader() {
        this.loader!.getComponent(CircularLoader)!.showLoader(LoaderType.FULL_SCREEN);
    }

    hideLoader() {
        this.loader!.getComponent(CircularLoader)!.stopLoader();
    }

    update(deltaTime: number) { }
}
