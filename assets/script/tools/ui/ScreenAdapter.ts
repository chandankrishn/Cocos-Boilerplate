import { EventManager } from '../../managers/EventManager';
import { _decorator, Canvas, Component, find, Node, NodeEventType, ResolutionPolicy, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdapter')
export class ScreenAdapter extends Component {
    /**
 * Life cycle: load
 */
    protected onLoad() {
        this.init();
    }

    /**
     * Life cycle: component enabled
     */
    protected onEnable() {
        this.onResize();
    }

    /**
     * Life cycle: component start
     */
    protected start() {
        this.onResize();
    }

    /**
     * 初始化
     */
    protected init() {
        // Set the callback of changes in the game window (only the web platform is valid)
        view.setResizeCallback(() => this.onResize())
    }

    /**
     * 窗口变化回调
     */
    protected onResize() {

        // adaptation
        this.adapt();
        // Because SetResizeCallBack can only set up a callbackback
        // Use the event system to send a specific event, so that other components can also monitor the window changes
        EventManager.emit('view-resize');
    }

    /**
     * 适配
     */
    protected adapt() {
        // Actual screen ratio
        const winSize = view.getVisibleSize(),
            screenRatio = winSize.width / winSize.height;
        // Design ratio
        const designResolution = view.getDesignResolutionSize(),
            designRatio = designResolution.width / designResolution.height;
        // Determine the actual screen width and height ratio
        if (screenRatio <= 1) {
            // At this time, the screen height is greater than width
            if (screenRatio <= designRatio) {
                this.setFitWidth();
            } else {
                // At this time, the actual screen ratio is greater than the design ratio
                // In order to ensure that the content of the vertical game is not affected, the Fitheight mode should be used
                this.setFitHeight();
            }
        } else {
            // At this time, the screen height is less than width
            this.setFitHeight();
        }
    }

    /**
     *Adaptation high mode
     */
    protected setFitHeight() {
        view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT)
    }

    /**
     * Adaptive width mode
     */
    protected setFitWidth() {
        view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH)
    }
}

