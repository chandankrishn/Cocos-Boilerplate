import { Component, EditBox, _decorator, Node } from "cc";
import FontSystem from "../../FontSystem";
import { FontSystemWeight, FontSystemWeightCustom } from "../../FontSystemModel";
import ThemeSystem from "../../ThemeSystem";
import { ColorSystemType, ColorSystemTypeOther, ColorSystemWeight } from "../../ThemeSystemModel";

const { ccclass, property, executeInEditMode, playOnFocus } = _decorator;


@ccclass
@executeInEditMode
@playOnFocus
export default class DesignSystemInput extends Component {
    @property({ type: Node }) left_icon: Node = null!;
    @property({ type: Node }) right_icon: Node = null!;
    @property({ type: EditBox }) edit_box: EditBox = null!;
    @property showLeftIcon: boolean = true;
    @property showRightIcon: boolean = false;


    editorFocus: boolean = false;

    onLoad() {
        this.setIcons();
        this.setTextStyle();
    }

    private setTextStyle() {
        if (this.edit_box != null) {
            let text_theme = this.edit_box.textLabel.getComponent(ThemeSystem);
            let text_font = this.edit_box.textLabel.getComponent(FontSystem);
            text_theme.setColorScheme(ColorSystemType.Other, ColorSystemTypeOther.White);
            text_font.fontWeight = FontSystemWeight.Custom;
            text_font.fontCustomWeight = FontSystemWeightCustom.W500;
            text_font.fontSize = 28;

            let placeholder_theme = this.edit_box.placeholderLabel.getComponent(ThemeSystem);
            let placeholder_font = this.edit_box.placeholderLabel.getComponent(FontSystem);
            placeholder_theme.setColorScheme(ColorSystemType.Vulcano);
            placeholder_theme.setColorWeight(ColorSystemWeight.W600);
            placeholder_font.fontSize = 20;
            placeholder_font.fontWeight = FontSystemWeight.Custom;
            placeholder_font.fontCustomWeight = FontSystemWeightCustom.W600;
        }
    }

    private setIcons() {
        this.left_icon.active = this.showLeftIcon;
        this.right_icon.active = this.showRightIcon;
    }

    onFocusInEditor() {
        this.editorFocus = true;
    }
    onLostFocusInEditor() {
        this.editorFocus = false;
    }
    update(dt: number) {
        if (this.editorFocus) {
            this.setIcons();
            this.setTextStyle();
        }
    }
}
