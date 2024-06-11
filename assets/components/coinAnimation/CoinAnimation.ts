import { _decorator, Component, Enum, instantiate, Node, Prefab, tween, v2, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum animationType {
    ONCE,
    INFINITE,
}

@ccclass('CoinAnimation')
export class CoinAnimation extends Component {
    @property({ type: Prefab, visible: true })
    private coinPrefab: Prefab = null!;

    @property({ type: Node, visible: true })
    private startPos: Node = null!;

    @property({ type: Node, visible: true })
    private endPos: Node = null!;

    @property({ type: Enum(animationType), visible: true })
    private animationType: animationType = animationType.ONCE;

    private coins_anim: any = [];

    private animationTimes = -5;

    onEnable() {
        if (this.animationType == animationType.ONCE) this.animationTimes = 1;
        else if (this.animationType == animationType.INFINITE) this.animationTimes = -1;
    }

    onLoad() {
        this.initCoinPool();
    }

    initCoinPool() {
        // Instantiate Coins.
        this.coins_anim = [];
        for (let i = 0; i < 15; i++) {
            const coin = instantiate(this.coinPrefab);
            coin.active = false;
            coin.children[0].active = true;
            this.node.parent!.addChild(coin);
            this.coins_anim.push(coin);
        }
    }

    showCoinAnimation() {
        if (!this.animationTimes) return;
        if (this.animationTimes > 0) this.animationTimes--;
        // / Coin Animation from here.
        const rand = Math.random() > 0.5 ? -500 : 500;
        for (const coin of this.coins_anim) {
            // coin.stopAllActions();
            coin.active = true;
            const start = this.startPos.getPosition();
            const end = this.endPos.getPosition();
            const mid = v2(start.x + rand, (end.y - start.y) * 0.5 * (Math.random() * 0.5 - Math.random() * 0.2));
            const bezier = [start, mid, end];
            coin.setPosition(start);
            this.bezierTo(coin, Math.random() + 1.25, v2(start.x, start.y), v2(mid.x, mid.y), v3(end.x, end.y, 0), null, () => {
                console.log("END")
                coin.active = false;
            }).start()

        }
        this.initCoinPool();
    }

    /**
 *  二阶贝塞尔曲线 运动
 * @param target
 * @param {number} duration
 * @param {} c1 起点坐标
 * @param {} c2 控制点
 * @param {Vec3} to 终点坐标
 * @param opts
 * @returns {any}
 */
    bezierTo(target: any, duration: number, c1: Vec2, c2: Vec2, to: Vec3, opts: any, callback: Function) {
        opts = opts || Object.create(null);
        /**
         * @desc 二阶贝塞尔
         * @param {number} t 当前百分比
         * @param {} p1 起点坐标
         * @param {} cp 控制点
         * @param {} p2 终点坐标
         * @returns {any}
         */
        let twoBezier = (t: number, p1: Vec2, cp: Vec2, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            return v3(x, y, 0);
        };
        opts.onUpdate = (arg: Vec3, ratio: number) => {
            target.position = twoBezier(ratio, c1, c2, to);
        };
        return tween(target).to(duration, {}, opts).call(callback);
    }
}