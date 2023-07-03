import {
  _decorator,
  Component,
  Sprite,
  Enum,
  isValid,
  Size,
  Rect,
  NodeEventType,
  UITransform,
} from "cc";
import { EDITOR } from "cc/env";
export enum APAspectRatioFitType {
  None,
  FitVertical,
  FitHorizontal,
  Envelope,
  FitInside,
  Stretch,
}

const { ccclass, property, menu, executeInEditMode } = _decorator;

@ccclass
@menu("Custom UI/Aspect Ratio Fitter")
@executeInEditMode
export class APAspectRatioFitter extends Component {
  @property(Sprite) sprite: Sprite = null;

  @property({ type: Enum(APAspectRatioFitType), serializable: true, visible: false })
  private _fitMode: APAspectRatioFitType = APAspectRatioFitType.Envelope;
  @property({ type: Enum(APAspectRatioFitType) })
  get fitMode() {
    return this._fitMode;
  }
  set fitMode(value) {
    this._fitMode = value;
    this.onSizeChanged();
  }

  onLoad() {
    if (EDITOR) {
      this.sprite = this.getComponent(Sprite);
    }

    this.onSizeChanged();
    this.node.parent.on(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
  }

  onDestroy() {
    if (isValid(this.node, true))
      this.node.parent.off(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
  }

  onSizeChanged() {
    if (this.sprite === null) return;

    var spriteSize: Size = this.sprite.spriteFrame.originalSize;
    if (this.sprite.trim) {
      let _rect: Rect = this.sprite.spriteFrame.rect;
      spriteSize = new Size(_rect.width, _rect.height);
    }
    var widthFactor: number = this.node.parent.getComponent(UITransform).width / spriteSize.width;
    var heightFactor: number =
      this.node.parent.getComponent(UITransform).height / spriteSize.height;

    switch (this.fitMode) {
      case APAspectRatioFitType.Envelope:
        var multFactor: number = Math.max(widthFactor, heightFactor);
        this.node.getComponent(UITransform).width = spriteSize.width * multFactor;
        this.node.getComponent(UITransform).height = spriteSize.height * multFactor;
        break;
      case APAspectRatioFitType.FitVertical:
        this.node.getComponent(UITransform).height =
          this.node.parent.getComponent(UITransform).height;
        this.node.getComponent(UITransform).width = spriteSize.width * heightFactor;
        break;
      case APAspectRatioFitType.FitHorizontal:
        this.node.getComponent(UITransform).width =
          this.node.parent.getComponent(UITransform).width;
        this.node.getComponent(UITransform).height = spriteSize.height * widthFactor;
        break;
      case APAspectRatioFitType.FitInside:
        var multFactor: number = Math.min(widthFactor, heightFactor);
        this.node.getComponent(UITransform).width = spriteSize.width * multFactor;
        this.node.getComponent(UITransform).height = spriteSize.height * multFactor;
        break;
      case APAspectRatioFitType.Stretch:
        this.node.getComponent(UITransform).width =
          this.node.parent.getComponent(UITransform).width;
        this.node.getComponent(UITransform).height =
          this.node.parent.getComponent(UITransform).height;
        break;
      default:
        break;
    }
  }
}
