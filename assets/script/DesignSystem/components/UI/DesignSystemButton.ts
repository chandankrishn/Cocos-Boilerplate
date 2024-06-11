import { _decorator, Button, Component, Label, SpriteFrame, Enum, Color, Sprite, Node } from "cc";
import { Gradient } from "../../../../Shader/Gradient/Gradient";
import ThemeSystem from "../../ThemeSystem";
import { ColorSystemType, ColorSystemTypeOther, ColorSystemWeight, ThemeSystemModel, ThemeSystemType } from "../../ThemeSystemModel";

const { ccclass, property, executeInEditMode, playOnFocus, requireComponent } = _decorator;


export enum ButtonStyle {
    Primary = 0,
    Secondary,
    Outline,
    OverlayOutline,
    UsePreset,
    UsePresetGradient
}

export enum ButtonSize {
    Large = 0,
    Medium,
    Small
}

@ccclass
@executeInEditMode
@playOnFocus
@requireComponent(Button)
export default class DesignSystemButton extends Component {
    @property({ type: Node }) background: Node = null;
    @property({ type: Label }) title: Node = null;
    @property({ type: SpriteFrame }) backgroundSF: SpriteFrame = null;
    @property({ type: SpriteFrame }) outlineSF: SpriteFrame = null;

    @property({ type: Enum(ButtonStyle) }) buttonStyle: ButtonStyle = ButtonStyle.Primary;
    @property({ type: Enum(ButtonSize) }) buttonSize: ButtonSize = ButtonSize.Large;

    @property width: number = 200;


    editorFocus: boolean = false;

    onLoad() {
        this.setButtonSize(this.buttonSize);
        this.setButtonStyle(this.buttonStyle);
    }

    private updateInteractionColors() {
        this.getComponent(Button).hoverColor = new Color(this.background.color.r, this.background.color.g, this.background.color.b, this.background.opacity * 0.9);
        this.getComponent(Button).pressedColor = new Color(this.background.color.r, this.background.color.g, this.background.color.b, this.background.opacity * 0.8);
        this.getComponent(Button).disabledColor = new Color(this.background.color.r, this.background.color.g, this.background.color.b, this.background.opacity * 0.7);
    }

    setButtonSize(size: ButtonSize) {
        if (this.background == null)
            return;
        switch (size) {
            case ButtonSize.Small:
                this.node.setContentSize(this.width, 72);
                break;
            case ButtonSize.Medium:
                this.node.setContentSize(this.width, 80);
                break;
            case ButtonSize.Large:
                this.node.setContentSize(this.width, 92);
                break;
        }
    }

    setButtonStyle(style: ButtonStyle) {
        switch (style) {
            case ButtonStyle.Primary:
                this.background.color = Color.WHITE;
                this.background.getComponent(Gradient).enabled = true;
                this.background.getComponent(Sprite).spriteFrame = this.backgroundSF;
                this.title.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Nero);
                this.title.getComponent(ThemeSystem).setColorWeight(ColorSystemWeight.W800);
                this.updateInteractionColors();
                break;
            case ButtonStyle.Secondary:
                this.background.getComponent(Sprite).spriteFrame = this.outlineSF;
                this.background.getComponent(Gradient).enabled = false;
                this.title.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Gold);
                this.title.getComponent(ThemeSystem).setColorWeight(ColorSystemWeight.W400);
                this.background.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Gold);
                this.background.getComponent(ThemeSystem).setColorWeight(ColorSystemWeight.W400);
                this.updateInteractionColors();
                break;
            case ButtonStyle.Outline:
                this.background.getComponent(Sprite).spriteFrame = this.outlineSF;
                this.background.getComponent(Gradient).enabled = false;
                this.title.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Other, ColorSystemTypeOther.White);
                this.background.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Vulcano);
                this.background.getComponent(ThemeSystem).setColorWeight(ColorSystemWeight.W600);
                this.updateInteractionColors();
                break;
            case ButtonStyle.OverlayOutline:
                this.background.getComponent(Sprite).spriteFrame = this.backgroundSF;
                this.background.getComponent(Gradient).enabled = false;
                this.title.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Other, ColorSystemTypeOther.White);
                this.background.getComponent(ThemeSystem).customColor = new Color().fromHEX("22232C");
                this.background.getComponent(ThemeSystem).setColorScheme(ColorSystemType.Other, ColorSystemTypeOther.Custom);
                this.updateInteractionColors();
                break;
            case ButtonStyle.UsePreset:
                this.background.getComponent(Gradient).enabled = false;
                this.updateInteractionColors();
                break;
            case ButtonStyle.UsePresetGradient:
                this.background.getComponent(Gradient).enabled = true;
                this.updateInteractionColors();
                break;
        }
    }

    onFocusInEditor() {
        this.editorFocus = true;
    }
    onLostFocusInEditor() {
        this.editorFocus = false;
    }
    update(dt: number) {
        if (this.editorFocus) {
            this.setButtonSize(this.buttonSize);
            this.setButtonStyle(this.buttonStyle);
        }
    }
}
