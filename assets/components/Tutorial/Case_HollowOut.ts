import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
import { HollowOut } from './HollowOut';
import { TouchBlocker } from '../TouchBlocker';
const { ccclass, property } = _decorator;

@ccclass('Case_HollowOut')
export class Case_HollowOut extends Component {
    @property(HollowOut)
    protected hollowOut: HollowOut = null!;

    @property(TouchBlocker)
    protected touchBlocker: TouchBlocker = null!;

    @property(Node)
    protected startBtn: Node = null!;

    @property(Node)
    protected oneBtn: Node = null!;

    @property(Node)
    protected twoBtn: Node = null!;

    @property(Node)
    protected threeBtn: Node = null!;

    protected onLoad() {
        this.registerEvent();
    }

    protected start() {
        this.reset();
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        this.startBtn.on(Node.EventType.TOUCH_END, this.onStartBtnClick, this);
        this.oneBtn.on(Node.EventType.TOUCH_END, this.onOneBtnClick, this);
        this.twoBtn.on(Node.EventType.TOUCH_END, this.onTwoBtnClick, this);
        this.threeBtn.on(Node.EventType.TOUCH_END, this.onThreeBtnClick, this);
    }

    /**
     * 重置
     */
    protected reset() {
        // 打开遮罩
        this.hollowOut.node.active = true;
        // 将遮罩镂空设为节点大小
        this.hollowOut.setNodeSize();
        // 放行所有点击
        this.touchBlocker.passAll();
    }

    /**
     * 开始
     */
    protected async onStartBtnClick() {
        // 屏蔽所有点击
        this.touchBlocker.blockAll();
        // 遮罩动起来
        console.log("onStartBtnClick")
        const node = this.oneBtn,
            x = node.getComponent(UITransform)?.getBoundingBox().width! + 10,
            y = node.getComponent(UITransform)?.getBoundingBox().height! + 10;
        await this.hollowOut.rectTo(0.5, new Vec2(node.position.x, node.position.y), x, y, 5, 5);
        // 设置可点击节点
        this.touchBlocker.setTarget(node);
    }

    /**
     * 按钮 1 点击回调
     */
    protected async onOneBtnClick() {
        // 将遮罩镂空设为节点大小
        this.hollowOut.setNodeSize();
        // 屏蔽所有点击
        this.touchBlocker.blockAll();
        // 遮罩动起来
        const node = this.twoBtn,
            x = node.getComponent(UITransform)?.getBoundingBox().width! + 10,
            y = node.getComponent(UITransform)?.getBoundingBox().height! + 10;
        await this.hollowOut.rectTo(0.5, new Vec2(node.position.x, node.position.y), x, y, 5, 5);
        // 设置可点击节点
        this.touchBlocker.setTarget(node);
    }

    /**
     * 按钮 2 点击回调
     */
    protected async onTwoBtnClick() {
        // 将遮罩镂空设为节点大小
        this.hollowOut.setNodeSize();
        // 屏蔽所有点击
        this.touchBlocker.blockAll();
        // 遮罩动起来
        const node = this.threeBtn;
        await this.hollowOut.circleTo(0.5, new Vec2(node.position.x, node.position.y), node.getComponent(UITransform)?.getBoundingBox().width! / 2, 0);
        // 设置可点击节点
        this.touchBlocker.setTarget(node);
    }

    /**
     * 按钮 3 点击回调
     */
    protected onThreeBtnClick() {
        // 将遮罩镂空设为节点大小
        this.hollowOut.setNodeSize();
        // 放行所有点击
        this.touchBlocker.passAll();
    }

}

