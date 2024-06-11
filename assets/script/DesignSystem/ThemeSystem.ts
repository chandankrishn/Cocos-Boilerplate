import { Color, Component, Enum, Label, _decorator } from "cc";
import { ThemeSystemType, ColorSystemType, ColorSystemWeight, ColorSystemTypeOther, ThemeSystemModel } from "./ThemeSystemModel";
import { EDITOR } from "cc/env";

const { ccclass, property, executeInEditMode, playOnFocus, menu } = _decorator;


@ccclass
@executeInEditMode
@playOnFocus
@menu("Design System/Theme System")
export default class ThemeSystem extends Component {
    @property({ type: Enum(ThemeSystemType) }) themeType: ThemeSystemType = ThemeSystemType.Default;
    @property({ type: Enum(ColorSystemType) }) colorScheme: ColorSystemType = ColorSystemType.Nero;
    @property({
        type: Enum(ColorSystemWeight),
        visible: function (this: ThemeSystem) {
            return this.colorScheme != ColorSystemType.Other
        }
    }
    ) colorWeight: ColorSystemWeight = ColorSystemWeight.W400;
    @property({
        type: Enum(ColorSystemTypeOther),
        visible: function (this: ThemeSystem) {
            return this.colorScheme == ColorSystemType.Other
        }
    }
    ) colorSchemeOther: ColorSystemTypeOther = ColorSystemTypeOther.Blue;
    @property({
        tooltip: "Custom color",
        visible: function (this: ThemeSystem) {
            return this.colorScheme == ColorSystemType.Other
                && this.colorSchemeOther == ColorSystemTypeOther.Custom
        }
    })
    customColor: Color = Color.WHITE.clone();

    @property shouldAutoUpdateInEditor: boolean = true;
    editorFocus: boolean = false;

    onLoad() {
        if (EDITOR && this.shouldAutoUpdateInEditor == false)
            return;
        this.setTheme(ThemeSystemType.Default);
    }

    public setTheme(theme: ThemeSystemType) {
        this.themeType = theme;
        this.applyTheme();
    }

    public setColorScheme(scheme: ColorSystemType, otherColor: ColorSystemTypeOther = 0) {
        this.colorScheme = scheme;
        this.colorSchemeOther = otherColor;
        this.applyTheme();
    }

    public setColorWeight(weight: ColorSystemWeight) {
        this.colorWeight = weight;
        this.applyTheme();
    }

    protected applyTheme() {
        let themeColor: Color;
        if (this.colorScheme == ColorSystemType.Other && this.colorSchemeOther == ColorSystemTypeOther.Custom)
            themeColor = this.customColor;
        else
            themeColor = ThemeSystemModel.getInstance().getColor(this.themeType, this.colorScheme, this.colorWeight, this.colorSchemeOther)

        //prevent warning from cocos for setting alpha in color
        if (255 > themeColor.a) {
            let opacity = themeColor.a;
            themeColor.a = 255;
            this.node.getComponent(Label)!.color = themeColor;
            // this.node.opacity = opacity;
        }
        else {
            this.node.getComponent(Label)!.color = themeColor;
        }
    }

    onFocusInEditor() {
        this.editorFocus = true;
    }
    onLostFocusInEditor() {
        this.editorFocus = false;
    }
    update(dt: number) {
        if (this.editorFocus && this.shouldAutoUpdateInEditor)
            this.applyTheme();
    }
}
