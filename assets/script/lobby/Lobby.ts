import {
    _decorator,
    Component,
    director,
    Node,
    Prefab,
    settings,
    Sprite,
    SpriteFrame,
} from "cc";
import { ASSET_CACHE_MODE, POPUPS } from "../constants/Popup";
import { PopupManager } from "../managers/PopupManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import { UIButton } from "../tools/ui/button/UIButton";
import { NodeBase } from "../comman/NodeBase";
import { TableView } from "../../components/tableview/TableView";

const { ccclass, property } = _decorator;

@ccclass("lobby")
export class lobby extends Component {
    @property({ type: UIButton })
    buttonWithEvents: UIButton | null = null;

    @property({ type: Prefab })
    testPrefab: Prefab | null = null;

    @property({ type: SpriteFrame })
    spriteframe: SpriteFrame | null = null;

    @property({ type: Sprite })
    validateNode: Sprite | null = null!;

    @property({ type: TableView, serializable: true })
    tv: TableView = null!;

    // @property({ type: Node })
    start() {
        //Sample function trigger
        // this.buttonWithEvents?.InteractedEvent.on(this.handleButtonCB, this);
        // this.buttonWithEvents?.InteractedEvent.on(() => {
        //     console.log("Hi how are you doing");
        //     // this.buttonWithEvents?.InteractedEvent.off(this.handleButtonCB);
        // }, this);
        this.tv.init(10, [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    }
    handleButtonCB() {
        // director.loadScene("Gameplay");
        console.log("current active ", window.performance.getEntries());
        // console.log("Callled handle button CB");
        // const enemy = new NodeBase();
        // // this.validateNode && (this.validateNode.spriteFrame = this.spriteframe);
        // enemy.node = new Node();
        // enemy.spriteFrame = this.spriteframe;
        // enemy.widht = 100;
    }

    onDropdownSelected(event: any, customEventData: string) {
        let node: Node = event.currentTarget;
        console.log(node, customEventData);
    };

    openPopup() {
        let data: string =
            "Anything you want to can be accessed in base class of popup";

        PopupManager.show(POPUPS.SETTINGS, data);
    }

    async loadResources() {
        let asstets = await ResourcesManager.loadArrayOfResource([
            { settingsPopup: "prefabs/settingsPopup" },
            { settingsPopup2: "prefabs/settingsPopup2" },
        ]);
    }
    update(deltaTime: number) { }
}
