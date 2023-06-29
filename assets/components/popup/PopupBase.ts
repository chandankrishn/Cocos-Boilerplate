import {
  _decorator,
  BlockInputEvents,
  Button,
  Component,
  Node,
  tween,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PopupBase")
export default class PopupBase<Options = any> extends Component {
  /**
   * Overlay Node of pop background
   */
  @property({ type: Node, tooltip: "Overlay backgorund node" })
  public background: Node = null;

  
  /**
   * Main popup Node
   */
  @property({ type: Node, tooltip: " Background node" })
  public main: Node = null;
  /**
   * Animation Duration of tween
   */
  public animationDuration: number = 0.3;

  /**
   * Touch blocker node
   */
  protected blocker: Node = null;

  protected options: Options = null;

  /**
   * Popup show aniamtion
   * @param options
   * @param duration
   */
  public async show(options?: Options, duration?: number) {
    this.options = options;
    this.init(options);
    this.updateDisplay(options);
    this.onBeforeShow && (await this.onBeforeShow());
    if (duration == undefined) {
      duration = duration < 0 ? 0 : this.animationDuration;
    }
    await this.playShowAnimation(duration);
    this.onAfterShow && this.onAfterShow();
  }
  /**
   * Play Hide Aniamtion of popup
   * @param duration
   * @returns
   */
  protected playHideAnimation(duration: number): Promise<void> {
    return new Promise<void>((res) => {
      // tween(this.background)
      //   .delay(duration * 0.5)
      //   .to(duration * 0.5, { o : 0 })
      //   .start();
      // Popcae main body
      tween(this.main)
        .to(duration, { scale: new Vec3(0.5, 0.5, 1) }, { easing: "backIn" })
        .call(res)
        .start();
    });
  }

  /**
   * Hide Pop initaial checker for blockers and send suspended call so that if we have another popup available can be called
   * @param suspended
   * @param duration
   */
  public async hide(suspended: boolean = false, duration?: number) {
    const node = this.node;
    // When the animation duration is not 0, intercept the click event (avoid misunderstanding)
    // if (duration !== 0) {
    let blocker = this.blocker;

    //Adding blocker for popup
    if (!blocker) {
      blocker = this.blocker = new Node("blocker");
      blocker.addComponent(Button);
      this.node.addChild(blocker);

      blocker
        .getComponent(UITransform)
        .setContentSize(node.getComponent(UITransform).getBoundingBox());
    }
    // pop -up bonus
    this.onBeforeHide && (await this.onBeforeHide(suspended));
    // Play hidden animation
    if (duration == undefined) {
      duration = duration < 0 ? 0 : this.animationDuration;
    }
    await this.playHideAnimation(duration);
    // Close the interception
    this.blocker && (this.blocker.active = false);
    // Close the node
    node.active = false;
    // pop -up bonus
    this.onAfterHide && this.onAfterHide(suspended);
    // The pop -up window completes the callback
    this.finishCallback && this.finishCallback(suspended);
  }

  protected playShowAnimation(duration: number): Promise<void> {
    // this.scheduleOnce;
    return new Promise<void>((res) => {
      // Initialization node
      const background = this.background,
        main = this.main;
      this.node.active = true;
      background.active = true;
      // background.opacity = 0;
      // main.active = true;
      main.scale = new Vec3(0.5, 0.5, 0.5);
      // main.opacity = 0;
      // Background masks
      // tween(background)
      //   .to(duration * 0.5, { opacity: 150 })
      //   .start();
      // Popcae main body
      tween(main)
        .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" })
        .call(res)
        .start();
    });
  }
  protected init(options: Options) {}
  protected updateDisplay(options: Options) {}
  protected onBeforeShow(): Promise<void> {
    return new Promise((res) => res());
  }
  protected onAfterShow() {}
  protected onBeforeHide(suspended: boolean): Promise<void> {
    return new Promise((res) => res());
  }
  protected onAfterHide(suspended: boolean) {}
  protected onSuspended(): Promise<void> {
    return new Promise((res) => res());
  }
  protected finishCallback: (suspended: boolean) => void = null;
}
