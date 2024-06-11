import { _decorator, Component, EventTouch, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchBlocker')
export class TouchBlocker extends Component {
    @property({ type: Node, tooltip: '可被点击的节点' })
    public target: Node = null!;

    /**
     * 拦截状态
     */
    protected isBlockAll: boolean = false;

    /**
     * 放行状态
     */
    protected isPassAll: boolean = false;

    /**
     * 生命周期：加载
     */
    protected onLoad() {
        this.registerEvent();
    }

    /**
     * 生命周期：节点开始
     */
    protected start() {
        this.reset();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        // TODO
        // this.node.on(Node.EventType.TOUCH_START, this.onTouchEvent, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchEvent, this);
        // this.node.on(Node.EventType.TOUCH_END, this.onTouchEvent, this);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        this.node.targetOff(this);
    }

    /**
     * 重置
     */
    protected reset() {
        // 取消吞噬事件
        this.setSwallowTouches(false);
    }

    /**
     * 事件回调
     * @param event 事件
     */
    protected onTouchEvent(event: EventTouch) {
        // 全部放行状态
        event.propagationStopped = false;
        if (this.isPassAll) {
            return;
        }
        console.log("CHECK 1")
        // 拦截状态并且无目标
        if (this.isBlockAll || !this.target) {
            event.propagationStopped = true;
            console.log("CHECK 2")

            return;
        }
        // 点击是否命中目标节点
        const targetRect = this.target.getComponent(UITransform)?.getBoundingBoxToWorld()!,
            isContains = targetRect.contains(event.getLocation());
        if (!isContains) {
            console.log("CHECK 3")

            event.propagationStopped = true;
        }
    }

    /**
     * 屏蔽所有点击
     */
    public blockAll() {
        this.isBlockAll = true;
        this.isPassAll = false;
    }

    /**
     * 放行所有点击
     */
    public passAll() {
        this.isPassAll = true;
        this.isBlockAll = false;
    }

    /**
     * 设置可点击的节点
     * @param node 节点
     */
    public setTarget(node: Node) {
        this.target = node;
        this.isBlockAll = false;
        this.isPassAll = false;
    }

    /**
     * 设置节点是否吞噬点击事件
     * @param swallow 状态
     */
    public setSwallowTouches(swallow: boolean) {
        // TODO
        // this.node._touchListener && this.node._touchListener.setSwallowTouches(swallow);
    }
}

