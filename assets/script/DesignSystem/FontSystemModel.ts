import { Font, assetManager, error, resources } from "cc";
import { EDITOR } from "cc/env";

export enum FontSystemType {
    SFProDisplay = 0
}

export enum FontSystemWeight {
    Custom = 0,
    TitleSemibold,
    HeadlineSemibold,
    TextSemiBold,
    Text1Medium,
    Text2Regular,
    Text3Regular,
    Text4Medium,
    Subhead1Medium,
    Subhead2Semibold,
    CaptionCapsSemibold,
    CaptionCapsMedium
}

export enum FontSystemWeightCustom {
    W100 = 0,
    W200,
    W300,
    W400,
    W500,
    W600,
    W700,
    W800,
    W900
}

declare const Editor: any;
export class FontSystemModel {
    private static instance: FontSystemModel;
    private fontData: any = {};

    private fontCache: Map<string, Font> = new Map<string, Font>();

    public static getInstance(): FontSystemModel {
        if (!this.instance) {
            this.instance = new FontSystemModel();
        }
        return this.instance;
    }

    constructor() {
        this.initFontCache();
    }

    private initFontCache() {
        for (let font = 0; font < Object.keys(FontSystemType).length; font++) {
            for (let weight = 0; weight < Object.keys(FontSystemWeightCustom).length; weight++) {
                this.addFontWeightToCache(font, weight);
            }
        }
    }

    private async addFontWeightToCache(font: FontSystemType, weight: FontSystemWeightCustom) {
        let fontPath = this.getFontPath(font, FontSystemWeight.Custom, weight);
        // if (EDITOR) {
        //     let editorPath = Editor.assetdb.remote.urlToUuid("db://assets/resources/" + fontPath + ".ttf");
        //     assetManager.loadAny({ "uuid": editorPath }, function (err, font) {
        //         if (err) {
        //             error(err.message || err);
        //             return;
        //         }
        //         this.fontCache.set(fontPath, font);
        //     }.bind(this));
        //     return;
        // };
        // console.log(`[SCENE] ${fontPath} `)
        if (EDITOR) {
            const editorPath = `db://assets/resources/${fontPath}.ttf`
            const result = await Editor.Message.request(`asset-db`, `query-asset-info`, editorPath);
            // console.log(`[SCENE] ${editorPath} ${result.uuid}`)
            assetManager.loadAny({ "uuid": result.uuid }, function (err, font) {
                if (err) {
                    error(err.message || err);
                    return;
                }
                this.fontCache.set(fontPath, font);
            }.bind(this));
            return;
        };
        resources.load(fontPath, Font, function (err, font) {
            if (err) {
                error(err.message || err);
                return;
            }
            this.fontCache.set(fontPath, font);
        }.bind(this));
    }

    private getFontPath(font: FontSystemType, weight: FontSystemWeight, customWeight: FontSystemWeightCustom): string {
        let fontName = "Fonts";

        if (font == FontSystemType.SFProDisplay) {
            fontName += "/SF Pro Display";
            if (weight == FontSystemWeight.Custom) {
                switch (customWeight) {
                    case FontSystemWeightCustom.W100:
                        fontName += "/SF-Pro-Display-Ultralight";
                        break;
                    case FontSystemWeightCustom.W200:
                        fontName += "/SF-Pro-Display-Thin";
                        break;
                    case FontSystemWeightCustom.W300:
                        fontName += "/SF-Pro-Display-Light";
                        break;
                    case FontSystemWeightCustom.W400:
                        fontName += "/SF-Pro-Display-Regular";
                        break;
                    case FontSystemWeightCustom.W500:
                        fontName += "/SF-Pro-Display-Medium";
                        break;
                    case FontSystemWeightCustom.W600:
                        fontName += "/SF-Pro-Display-Semibold";
                        break;
                    case FontSystemWeightCustom.W700:
                        fontName += "/SF-Pro-Display-Bold";
                        break;
                    case FontSystemWeightCustom.W800:
                        fontName += "/SF-Pro-Display-Heavy";
                        break;
                    case FontSystemWeightCustom.W900:
                        fontName += "/SF-Pro-Display-Black";
                        break;
                }
            }
            else {
                switch (weight) {
                    case FontSystemWeight.TitleSemibold:
                    case FontSystemWeight.HeadlineSemibold:
                    case FontSystemWeight.TextSemiBold:
                    case FontSystemWeight.Subhead1Medium:
                    case FontSystemWeight.Subhead2Semibold:
                    case FontSystemWeight.CaptionCapsMedium:
                        fontName += "/SF-Pro-Display-Semibold";
                        break;
                    case FontSystemWeight.Text1Medium:
                    case FontSystemWeight.Text4Medium:
                        fontName += "/SF-Pro-Display-Medium";
                        break;
                    case FontSystemWeight.Text2Regular:
                    case FontSystemWeight.Text3Regular:
                        fontName += "/SF-Pro-Display-Regular";
                        break;
                    case FontSystemWeight.CaptionCapsSemibold:
                        fontName += "/SF-Pro-Display-Bold";
                        break;
                }
            }
        }
        return fontName;
    }

    public getFont(font: FontSystemType, weight: FontSystemWeight, customWeight: FontSystemWeightCustom = 0): Font {
        let fontPath = this.getFontPath(font, weight, customWeight);
        if (this.fontCache.has(fontPath))
            return this.fontCache.get(fontPath)!;
        return null!;
    }
}
