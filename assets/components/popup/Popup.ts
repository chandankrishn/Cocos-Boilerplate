import { _decorator, Component, Label, Node } from "cc";
import PopupBase from "./PopupBase";
import { PopupManager } from "../../script/managers/PopupManager";
const { ccclass, property } = _decorator;

@ccclass("Popup")
export class Popup extends PopupBase {
  @property(Node)
  protected closeBtn: Node = null;

  @property(Label)
  protected curFlagLabel: Label = null;

  @property(Label)
  protected newFlagLabel: Label = null;

  @property(Node)
  protected normalBtn: Node = null;

  @property(Node)
  protected priorityBtn: Node = null;

  @property(Node)
  protected immediatelyBtn: Node = null;

  protected newFlag: string = null;

  /** Pop -up path */
  public static get path() {
    return "prefabs/settingsPopup";
  }

  protected onLoad() {
    this.registerEvent();
  }

  protected onDestroy() {
    this.unregisterEvent();
  }

  protected registerEvent() {
    // this.closeBtn.on(Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
    // this.normalBtn.on(Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
    // this.priorityBtn.on(Node.EventType.TOUCH_END, this.onPriorityBtnClick, this);
    // this.immediatelyBtn.on(Node.EventType.TOUCH_END, this.onImmediatelyBtnClick, this);
  }

  protected unregisterEvent() {}

  protected updateDisplay(options: string) {
    this.curFlagLabel.string = options;
    this.updateFlag();
  }

  protected updateFlag() {
    this.newFlag = (Math.random() * 10000).toFixed(0).padStart(5, "0");
    this.newFlagLabel.string = this.newFlag;
  }

  protected onCloseBtnClick() {
    this.hide();
  }

  protected onNormalBtnClick() {
    const params = {
      mode: PopupManager.CacheMode.Normal,
      priority: 0,
    };
    PopupManager.show(Popup.path, this.newFlag, params);
    this.updateFlag();
  }

  protected onPriorityBtnClick() {
    const params = {
      mode: PopupManager.CacheMode.Normal,
      priority: -1,
    };
    PopupManager.show(Popup.path, this.newFlag, params);
    this.updateFlag();
  }

  protected onImmediatelyBtnClick() {
    const params = {
      mode: PopupManager.CacheMode.Frequent,
      immediately: true,
    };
    PopupManager.show(Popup.path, this.newFlag, params);
  }
}
