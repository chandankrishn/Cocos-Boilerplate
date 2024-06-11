import { _decorator, Label, Component, Enum, Font } from "cc";
import { FontSystemModel, FontSystemType, FontSystemWeight, FontSystemWeightCustom } from "./FontSystemModel";
const { ccclass, property, executeInEditMode, playOnFocus, requireComponent, menu } = _decorator;

@ccclass
@executeInEditMode
@playOnFocus
@requireComponent(Label)
@menu("Design System/Font System")
export default class FontSystem extends Component {
    @property({ type: Enum(FontSystemType) }) fontType: FontSystemType = FontSystemType.SFProDisplay;
    @property({ type: Enum(FontSystemWeight) }) fontWeight: FontSystemWeight = FontSystemWeight.Custom;
    @property({
        type: Enum(FontSystemWeightCustom),
        visible: function (this: FontSystem) {
            return this.fontWeight == FontSystemWeight.Custom;
        }
    }
    ) fontCustomWeight: FontSystemWeightCustom = FontSystemWeightCustom.W100;
    @property fontSize: number = 40;
    editorFocus: boolean = false;

    onLoad() {
        this.setFont(this.fontType);

    }

    public setFont(font: FontSystemType) {
        this.fontType = font;
        this.applyFont();
    }

    protected applyFont() {
        let label: Label = this.node.getComponent(Label)!;
        if (label) {
            let font: Font = FontSystemModel.getInstance().getFont(this.fontType, this.fontWeight, this.fontCustomWeight);
            if (font) {
                label.useSystemFont = false;
                label.font = font;
                label.fontSize = this.fontSize;
            }
        }
    }

    onFocusInEditor() {
        this.editorFocus = true;
    }
    onLostFocusInEditor() {
        this.editorFocus = false;
    }
    update(dt: number) {
        if (this.editorFocus)
            this.applyFont();
    }
}
