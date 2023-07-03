import { _decorator, Component, director, Node } from "cc";
import { ASSET_CACHE_MODE, POPUPS } from "../constants/Popup";
import { PopupManager } from "../managers/PopupManager";
const { ccclass, property } = _decorator;

@ccclass("lobby")
export class lobby extends Component {
  start() {}
  handleButtonCB() {
    director.loadScene("Gameplay");
  }

  openPopup() {
    // const options = (Math.random() * 10000).toFixed(0).padStart(5, "0");
    let data: string = "Anything you want to can be accessed in base class of popup";
    // const params = {
    //   mode: ASSET_CACHE_MODE.Frequent,
    // };
    PopupManager.show(POPUPS.SETTINGS, data);
  }
  update(deltaTime: number) {}
}
