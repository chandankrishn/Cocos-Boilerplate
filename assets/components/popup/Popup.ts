import { _decorator, Component, Label, Node } from "cc";
import PopupBase from "./PopupBase";
import { PopupManager } from "../../script/managers/PopupManager";
import { POPUPS } from "../../script/constants/Popup";
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

  protected registerEvent() {}

  protected unregisterEvent() {}

  protected updateDisplay(options: string) {
    this.curFlagLabel.string = options;
    this.updateFlag();
  }

  protected updateFlag() {
    // this.newFlag = (Math.random() * 10000).toFixed(0).padStart(5, "0");
    this.newFlagLabel.string = this.newFlag;
  }

  protected onCloseBtnClick() {
    this.hide();
  }

  protected onNormalBtnClick() {
    this.newFlag = "Normal Popup";
    PopupManager.show(POPUPS.TEST1, this.newFlag);
    this.updateFlag();
  }

  protected onPriorityBtnClick() {
    this.newFlag = "Priority high ";
    PopupManager.show(POPUPS.SETTINGS, this.newFlag);
    this.updateFlag();
  }

  protected onImmediatelyBtnClick() {
    this.newFlag = " Immediately open";
    PopupManager.show(POPUPS.TEST3, this.newFlag);
  }
}
