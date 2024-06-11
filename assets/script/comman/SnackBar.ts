import { _decorator, Component, Label, Node, Rect, tween, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SnackBar")
export class SnackBar extends Component {
  @property({ type: Label })
  message: Label = null!;

  nodeSize: Rect = null!;
  isAnimationPlaying: boolean = false;

  start() {
    this.nodeSize = this.node.getComponent(UITransform).getBoundingBox();
    this.setInitialPos();
  }

  private setInitialPos() {
    let parentSize = this.node.parent.getComponent(UITransform).getBoundingBox();
    let initPosX = parentSize.width / 2 + this.nodeSize.width / 2;
    let initPosY = parentSize.height / 2 - this.nodeSize.height / 2;
    this.node.setPosition(initPosX, initPosY);
  }

  public showSnackBar(message: string, duration: number, screenTime: number) {
    this.message.string = message;
    this.animation(duration, screenTime);
  }

  private animation(duration: number, screenTime: number) {
    if (this.isAnimationPlaying) {
      console.error(["Error from SnackBar: Animation PLaying"]);
      return;
    }
    tween(this.node)
      .call(() => {
        this.isAnimationPlaying = true;
      })
      .to(
        duration * 0.5,
        { position: new Vec3(this.node.position.x - this.nodeSize.width, this.node.position.y, 0) },
        { easing: "backOut" }
      )
      .delay(screenTime)
      .to(duration * 0.5, { position: new Vec3(this.node.position.x, this.node.position.y, 0) }, { easing: "backIn" })
      .call(() => {
        this.isAnimationPlaying = false;
      })
      .start();
  }
}
