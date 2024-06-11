import { EventManager } from "../../managers/EventManager";
import { _decorator, Component, Node, Vec3, View, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackgroundFitter")
export class BackgroundFitter extends Component {
    /**
     * Life cycle: load
     */
    protected onLoad() {
        this.registerEvent();
    }

    /**
     * Life cycle: component enabled
     */
    // protected onEnable() {
    //     this.adapt();
    // }

    /**
     * Life cycle: component start
     */
    protected start() {
        this.adapt();
    }

    /**
     * Life cycle: destruction
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * Registration issue
     */
    protected registerEvent() {
        // Node.EventType

        EventManager.on("view-resize", this.adapt, this);
    }

    /**
     * Anti -registration
     */
    protected unregisterEvent() {
        EventManager.off("view-resize", this.adapt, this);
    }

    /**
     * adaptation
     */
    protected adapt() {
        // Actual screen ratio
        const winSize = view.getVisibleSize(),
            screenRatio = winSize.height / winSize.width;
        // Design ratio
        const designResolution = view.getDesignResolutionSize(),
            designRatio = designResolution.height / designResolution.width;
        // Scaling
        let scale = 1;
        if (screenRatio >= designRatio) {
            scale = winSize.height / designResolution.height;
        } else {
            scale = winSize.width / designResolution.width;
        }
        this.node.setScale(new Vec3(scale, scale, scale));
    }
}
