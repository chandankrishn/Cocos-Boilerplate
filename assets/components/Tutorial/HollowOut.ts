import { _decorator, Component, EffectAsset, Enum, Material, Node, Sprite, Tween, tween, UITransform, v2, Vec2, warn } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = _decorator;

/** 镂空形状 */
export enum HollowOutShape {
    /** 矩形 */
    Rect = 1,
    /** 圆形 */
    Circle
}

@ccclass('HollowOut')
@requireComponent(Sprite)
@executeInEditMode
@disallowMultiple
@executionOrder(-10)
export class HollowOut extends Component {

    @property
    protected shapeType: HollowOutShape = HollowOutShape.Rect;
    @property({ type: Enum(HollowOutShape), tooltip: '镂空形状' })
    public get shape() { return this.shapeType; }
    public set shape(value: HollowOutShape) {
        this.shapeType = value;
        this.updateProperties();
    }

    @property
    protected _center: Vec2 = v2();
    @property({ tooltip: '中心坐标' })
    public get center() { return this._center; }
    public set center(value: Vec2) {
        this._center = value;
        this.updateProperties();
    }

    @property
    protected _width: number = 300;
    @property({ tooltip: '宽', visible() { return this.shapeType === HollowOutShape.Rect; } })
    public get width() { return this._width; }
    public set width(value: number) {
        this._width = value;
        this.updateProperties();
    }

    @property
    protected _height: number = 300;
    @property({ tooltip: '高', visible() { return this.shapeType === HollowOutShape.Rect; } })
    public get height() { return this._height; }
    public set height(value: number) {
        this._height = value;
        this.updateProperties();
    }

    @property
    protected _round: number = 1;
    @property({ tooltip: '圆角半径', visible() { return this.shapeType === HollowOutShape.Rect; } })
    public get round() { return this._round; }
    public set round(value: number) {
        this._round = value;
        this.updateProperties();
    }

    @property
    protected _radius: number = 200;
    @property({ tooltip: '半径', visible() { return this.shapeType === HollowOutShape.Circle; } })
    public get radius() { return this._radius; }
    public set radius(value: number) {
        this._radius = value;
        this.updateProperties();
    }

    @property
    protected _feather: number = 0.5;
    @property({ tooltip: '边缘虚化宽度', visible() { return this.shapeType === HollowOutShape.Circle || this.round > 0; } })
    public get feather() { return this._feather; }
    public set feather(value: number) {
        this._feather = value;
        this.updateProperties();
    }

    protected sprite: Sprite = null!;

    protected material: Material = null!;

    protected tweenRes: () => void = null!;

    protected onLoad() {
        this.init();
    }

    public resetInEditor() {
        this.init();
    }

    /**
     * 初始化组件
     */
    protected async init() {
        this.node.getComponent(Sprite)?.spriteFrame?.packable
        console.log("PPP: ", this.node.getComponent(Sprite)?.spriteFrame?.packable)
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    protected updateProperties() {
        switch (this.shapeType) {
            case HollowOutShape.Rect:
                this.rect(this._center, this._width, this._height, this._round, this._feather);
                break;
            case HollowOutShape.Circle:
                this.circle(this._center, this._radius, this._feather);
                break;
        }
    }

    /**
     * 矩形镂空
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    public rect(center?: Vec2, width?: number, height?: number, round?: number, feather?: number) {
        // 保存类型
        this.shapeType = HollowOutShape.Rect;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (width != null) {
            this._width = width;
        }
        if (height != null) {
            this._height = height;
        }
        if (round != null) {
            this._round = (round >= 0) ? round : 0;
            const min = Math.min(this._width / 2, this._height / 2);
            this._round = (this._round <= min) ? this._round : min;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
            this._feather = (this._feather <= this._round) ? this._feather : this._round;
        }
        // 更新材质
        this.material = this.node.getComponent(Sprite)?.customMaterial!
        const material = this.material;
        material.setProperty('size', this.getNodeSize());
        material.setProperty('center', this.getCenter(this._center));
        material.setProperty('width', this.getWidth(this._width));
        material.setProperty('height', this.getHeight(this._height));
        material.setProperty('round', this.getRound(this._round));
        material.setProperty('feather', this.getFeather(this._feather));

        console.log("Updating prop of shape type: ", this.shapeType)
        console.log('size', this.getNodeSize());
        console.log('center', this.getCenter(this._center));
        console.log('width', this.getWidth(this._width));
        console.log('height', this.getHeight(this._height));
        console.log('round', this.getRound(this._round));
        console.log('feather', this.getFeather(this._feather));

    }

    /**
     * 圆形镂空
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    public circle(center?: Vec2, radius?: number, feather?: number) {
        // 保存类型
        this.shapeType = HollowOutShape.Circle;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (radius != null) {
            this._radius = radius;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
        }
        // 更新材质
        const material = this.material;
        material.setProperty('size', this.getNodeSize());
        material.setProperty('center', this.getCenter(this._center));
        material.setProperty('width', this.getWidth(this._radius * 2));
        material.setProperty('height', this.getHeight(this._radius * 2));
        material.setProperty('round', this.getRound(this._radius));
        material.setProperty('feather', this.getFeather(this._feather));
    }

    /**
     * 缓动镂空（矩形）
     * @param time 时间
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    public rectTo(time: number, center: Vec2, width: number, height: number, round: number = 0, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this.shapeType = HollowOutShape.Rect;
            // 停止进行中的缓动
            Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 确认参数
            round = Math.min(round, width / 2, height / 2);
            feather = Math.min(feather, round);
            // 缓动
            tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    width: width,
                    height: height,
                    round: round,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null!;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 缓动镂空（圆形）
     * @param time 时间
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    public circleTo(time: number, center: Vec2, radius: number, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this.shapeType = HollowOutShape.Circle;
            // 停止进行中的缓动
            Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 缓动
            tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    radius: radius,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null!;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 取消所有挖孔
     */
    public reset() {
        this.rect(v2(), 0, 0, 0, 0);
    }

    /**
     * 挖孔设为节点大小（就整个都挖没了）
     */
    public setNodeSize() {
        const node: Node = this.node,
            width = node.getComponent(UITransform)?.width!,
            height = node.getComponent(UITransform)?.height!;
        this._radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        this.rect(new Vec2(node.position.x, node.position.y), width, height, 0, 0);
    }

    /**
     * 获取中心点
     * @param center 
     */
    protected getCenter(center: Vec2) {
        const node = this.node,
            width = node.getComponent(UITransform)?.width!,
            height = node.getComponent(UITransform)?.height!;
        const x = (center.x + (width / 2)) / width,
            y = (-center.y + (height / 2)) / height;
        return v2(x, y);
    }

    /**
     * 获取节点尺寸
     */
    protected getNodeSize() {
        return v2(this.node.getComponent(UITransform)?.width, this.node.getComponent(UITransform)?.height);
    }

    /**
     * 获取挖孔宽度
     * @param width 
     */
    protected getWidth(width: number) {
        return width / this.node.getComponent(UITransform)?.width!;
    }

    /**
     * 获取挖孔高度
     * @param height 
     */
    protected getHeight(height: number) {
        return height / this.node.getComponent(UITransform)?.width!;
    }

    /**
     * 获取圆角半径
     * @param round 
     */
    protected getRound(round: number) {
        return round / this.node.getComponent(UITransform)?.width!;
    }

    /**
     * 获取边缘虚化宽度
     * @param feather 
     */
    protected getFeather(feather: number) {
        return feather / this.node.getComponent(UITransform)?.width!;
    }
}

