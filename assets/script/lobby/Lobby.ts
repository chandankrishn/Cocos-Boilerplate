import { _decorator, Component, director, Node } from "cc";
import { PopupManager } from "../managers/PopupManager";
import { Popup } from "../../components/popup/Popup";
const { ccclass, property } = _decorator;

@ccclass("lobby")
export class lobby extends Component {
  start() {}
  handleButtonCB() {
    director.loadScene("Gameplay");
  }

  openPopup() {
    const options = (Math.random() * 10000).toFixed(0).padStart(5, "0");
    const params = {
      mode: PopupManager.CacheMode.Frequent,
    };
    PopupManager.show(Popup.path, options, params);
  }
  update(deltaTime: number) {}
}
