import { RequestCallback } from "./Constant";
import { IAPBase } from "./IAPBase";
import { ProductDetails } from "./ProductDetails";

/**
 * Class for managing In app Purchase End llayer for developer
 * @author Chandan Krishnani
 * @version 0.0.1
 */

export class IAPManager extends IAPBase {
    //Static instance of class
    private static _instance: IAPManager | null = null;

    // private _nativeBridge: NativeBridgeManager | NetworkManager = null!;

    //Getting instance of class
    public static get Instance() {
        if (!IAPManager._instance) {
            IAPManager._instance = new IAPManager();
        }
        return IAPManager._instance;
    }

    //Constructor to add initial details of product
    constructor() {
        super();
        //Filling up initial details of class
    }

    /**
     * JSb Birdge can only communicate in String so we need to pass all the product id
     * @returns string
     */
    public getProducts(
        successCB?: (products) => void,
        errorCB?: (message) => void
    ) {
        const products = this.getActiveProducts(); //IF we have active products fetched
        if (products.length > 0) {
            successCB && successCB(products);
            return; // you can remove this return to fetch the udpates in realtime data update
        }
        let callback: RequestCallback = {
            success: (products) => {
                successCB && successCB(products);
            },
            error: (message) => {
                errorCB && errorCB(message);
            },
        };
        this.helpingGetProducts(callback);

        // this._nativeBridge.fetchProducts(this._products, handleCb);
    }

    public buyProduct(
        productId: string,
        successCB?: (message) => void,
        errorCB?: (message) => void
    ) {
        let callback: RequestCallback = {
            success: (message) => {
                successCB && successCB(message);
            },
            error: (message) => {
                errorCB && errorCB(message);
            },
        };

        this.helpingBuyProduct(productId, callback);
    }
}
