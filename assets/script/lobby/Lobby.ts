import { _decorator, Component, director, Node, settings } from "cc";
import { ASSET_CACHE_MODE, POPUPS } from "../constants/Popup";
import { PopupManager } from "../managers/PopupManager";
import { ResourcesManager } from "../managers/ResourcesManager";
const { ccclass, property } = _decorator;

@ccclass("lobby")
export class lobby extends Component {
    start() {}
    handleButtonCB() {
        director.loadScene("Gameplay");
    }

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
        console.log("Assets ", asstets);
    }
    update(deltaTime: number) {}
}
