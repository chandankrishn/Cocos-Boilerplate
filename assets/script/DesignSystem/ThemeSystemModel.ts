import { Color } from "cc";

export enum ThemeSystemType {
    Default = 0,
    Light
}

export enum ColorSystemType {
    Other = 0,
    Nero,
    Gold,
    Vulcano,
}

export enum ColorSystemWeight {
    W400 = 0,
    W600,
    W800
}

export enum ColorSystemTypeOther {
    Custom = 0,
    Blue,
    Green,
    Pink,
    Orange,
    White,
    FadeWhite,
    Red
}

export class ThemeSystemModel {
    private static instance: ThemeSystemModel;
    private themeData: any = {};

    public static getInstance(): ThemeSystemModel {
        if (!this.instance) {
            this.instance = new ThemeSystemModel();
        }
        return this.instance;
    }

    constructor() {

        this.themeData = {
            [ThemeSystemType.Default]: {
                [ColorSystemType.Other]: {
                    [ColorSystemTypeOther.Blue]: new Color().fromHEX("#418DE5"),
                    [ColorSystemTypeOther.Green]: new Color().fromHEX("#0AC088"),
                    [ColorSystemTypeOther.Pink]: new Color().fromHEX("#F263B1"),
                    [ColorSystemTypeOther.Orange]: new Color().fromHEX("#E86238"),
                    [ColorSystemTypeOther.White]: new Color().fromHEX("#FFFFFF"),
                    [ColorSystemTypeOther.FadeWhite]: new Color().fromHEX("#FFFFFF08"),
                    [ColorSystemTypeOther.Red]: new Color().fromHEX("#FF0000")

                },
                [ColorSystemType.Nero]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#2E313E"), //background/dark3
                    [ColorSystemWeight.W600]: new Color().fromHEX("#20222E"), //background/dark1
                    [ColorSystemWeight.W800]: new Color().fromHEX("#171923") //background/dark2
                },
                [ColorSystemType.Gold]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#F0D5AA"), //text/gold_1
                    [ColorSystemWeight.W600]: new Color().fromHEX("#F5E1BF"), //main/accent_color_gold #1
                    [ColorSystemWeight.W800]: new Color().fromHEX("#C49D61") //main/accent_color_gold #2
                },
                [ColorSystemType.Vulcano]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#9FA1AF"), //text/gray_1
                    [ColorSystemWeight.W600]: new Color().fromHEX("#6F717E"), //text/gray2
                    [ColorSystemWeight.W800]: new Color().fromHEX("#CFD1DB")  ///text/light_gray
                }
            },
            [ThemeSystemType.Light]: {
                [ColorSystemType.Other]: {
                    [ColorSystemTypeOther.Blue]: new Color().fromHEX("#418DE5"),
                    [ColorSystemTypeOther.Green]: new Color().fromHEX("#0AC088"),
                    [ColorSystemTypeOther.Pink]: new Color().fromHEX("#F263B1"),
                    [ColorSystemTypeOther.Orange]: new Color().fromHEX("#E86238"),
                    [ColorSystemTypeOther.White]: new Color().fromHEX("#FFFFFF")
                },
                [ColorSystemType.Nero]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#2E313E"),
                    [ColorSystemWeight.W600]: new Color().fromHEX("#20222E"),
                    [ColorSystemWeight.W800]: new Color().fromHEX("#171923")
                },
                [ColorSystemType.Gold]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#2E313E"),
                    [ColorSystemWeight.W600]: new Color().fromHEX("#20222E"),
                    [ColorSystemWeight.W800]: new Color().fromHEX("#171923")
                },
                [ColorSystemType.Vulcano]: {
                    [ColorSystemWeight.W400]: new Color().fromHEX("#2E313E"),
                    [ColorSystemWeight.W600]: new Color().fromHEX("#20222E"),
                    [ColorSystemWeight.W800]: new Color().fromHEX("#171923")
                }
            }
        };
    }

    public getThemeData() {
        return this.themeData;
    }

    public getColor(theme: ThemeSystemType, colorSystem: ColorSystemType, weight: ColorSystemWeight, otherColor: ColorSystemTypeOther = 0): Color {
        if (colorSystem == ColorSystemType.Other)
            return this.themeData[theme][colorSystem][otherColor];
        return this.themeData[theme][colorSystem][weight];
    }

}