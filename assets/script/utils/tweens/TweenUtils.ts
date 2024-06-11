import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class TweenUtils {
    /**
     *Horizontal flip (card flip)
     * @param node node
     * @param duration total time
     * @param Onmiddle intermediate status recovery
     * @param OnComplete completes the callback
     * @example 
     * async flipCard() {
     *   await TweenUtil.flip(this.card.node, 1, () => {
     *       console.log("IN MIDDLE");
     *   }, () => {
     *       console.log("FLIP DONE");
     *   });
    } 
     */
    public static flip(node: Node, duration: number, onMiddle?: Function, onComplete?: Function): Promise<void> {
        return new Promise<void>(res => {
            const time = duration / 2;
            const scale = node.getScale();
            const scaleX = scale.x;
            tween(node)

                .to(time, { scale: new Vec3(0, scale.y, scale.z) }, { easing: 'quadIn' })
                .call(() => {
                    console.log("In Middle")
                    onMiddle && onMiddle();
                })
                .to(time, { scale: new Vec3(-scaleX, scale.y, scale.z) }, { easing: 'quadOut' })
                .call(() => {
                    onComplete && onComplete();
                    res();
                })
                .start();
        });
    }
}

