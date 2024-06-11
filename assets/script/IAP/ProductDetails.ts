import { Product, ProductNativeData, Reward } from "./Constant";

export class ProductDetails {
    private _productId: string = "";
    private _status: boolean = false;
    private _rewards: Reward;
    private _price: string = "";
    private _currency: string = "";
    private _description: string = "";
    private _title: string = "";
    private _metaData: {} = {};

    constructor(productData: Product) {
        this._productId = productData.productId;
        this._rewards = productData.reward;
    }

    public get Status() {
        return this._status;
    }

    public init(data: ProductNativeData) {
        this._price = data.formattedPrice;
        this._title = data.title;
        this._status = true;
    }

    public get ProductId() {
        return this._productId;
    }

    public get Price() {
        return this._price;
    }

    public get Rewards() {
        return this._rewards;
    }
    public get Title() {
        return this._title;
    }
}
