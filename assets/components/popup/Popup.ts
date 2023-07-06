import { _decorator, Component, Label, Node } from "cc";
import PopupBase from "./PopupBase";
import { PopupManager } from "../../script/managers/PopupManager";
import { POPUPS } from "../../script/constants/Popup";
const { ccclass, property } = _decorator;

@ccclass("Popup")
export class Popup extends PopupBase {
    @property(Node)
    protected closeBtn: Node | null = null;

    @property(Label)
    protected curFlagLabel: Label | null = null;

    @property(Label)
    protected newFlagLabel: Label | null = null;

    @property(Node)
    protected normalBtn: Node | null = null;

    @property(Node)
    protected priorityBtn: Node | null = null;

    @property(Node)
    protected immediatelyBtn: Node | null = null;

    protected newFlag: string | null = null;

    /** Pop -up path */
    public static get path() {
        return "prefabs/settingsPopup";
    }
    protected onEnable(): void {
        console.log("options", this.options);
    }
    protected onLoad() {
        this.registerEvent();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    protected registerEvent() {}

    protected unregisterEvent() {}
    updateData() {
        console.log("Hello world");
    }

    protected updateDisplay(options: string) {
        console.log("Update display", options);
        this.curFlagLabel && (this.curFlagLabel.string = options);
        this.updateFlag();
    }

    protected updateFlag() {
        // this.newFlag = (Math.random() * 10000).toFixed(0).padStart(5, "0");
        this.newFlagLabel && (this.newFlagLabel.string = this.newFlag || "");
    }

    protected onCloseBtnClick() {
        this.hide();
    }

    protected onNormalBtnClick() {
        this.hide();
        this.newFlag = "Normal Popup";
        PopupManager.show(POPUPS.TEST1, {
            name: "chandn",
            Label: this.newFlag,
        });
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
