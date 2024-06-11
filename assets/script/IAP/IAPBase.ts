import { _decorator, sys } from "cc";
import { NetworkManager } from "../managers/NetworkManager";
import { NativeBridgeManager } from "./NativeBridgeManager";
import { ProductDetails } from "./ProductDetails";
import {
    IAPProducts,
    NativeMessageEvents,
    ProductNativeData,
    RequestCallback,
    StatusCode,
} from "./Constant";

/**
 * Base class for and Middle layer to manager overall in app purchase
 * @author Chandan Krishnani
 * @version 0.0.1
 */

export class IAPBase {
    // Instance reference of class accordingly
    private _nativeBridge: NativeBridgeManager | NetworkManager;

    // Products we have in our base class
    public products: ProductDetails[] = [];

    // To setup bridge according to platform
    constructor() {
        this._nativeBridge = this.getNativeBridge();
        this.initProducts();
    }

    /**
     * Native bridge accoding to platform
     * @returns Bridge for communication
     */
    private getNativeBridge(): NativeBridgeManager | NetworkManager {
        switch (sys.platform) {
            case sys.Platform.ANDROID:
            case sys.Platform.IOS:
                return new NativeBridgeManager();
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                return NetworkManager.getInstance();
            default:
                throw new Error("Unsupported platform");
        }
    }

    /**
     * Intialize all products according to static ID's
     */
    private initProducts() {
        this.products = IAPProducts.map(
            (element) => new ProductDetails(element)
        );
    }

    private async fetchNativeProducts(): Promise<ProductNativeData[]> {
        return new Promise<ProductNativeData[]>((resolve, reject) => {
            if (!(this._nativeBridge instanceof NativeBridgeManager)) {
                throw new Error("NativeBridgeManager not available");
            }
            const data = this._nativeBridge.encodeDataFromArrayOfObject(
                IAPProducts,
                "productId"
            );
            this._nativeBridge.sendEventWithCallbackEvent(
                NativeMessageEvents.fetchProducts,
                data,
                (responseData: string) => {
                    try {
                        const response = JSON.parse(responseData);
                        if (response?.statusCode === StatusCode.Success) {
                            resolve(response.products);
                        } else {
                            reject(new Error(response.message));
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    private async buyProductNative(productId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!(this._nativeBridge instanceof NativeBridgeManager)) {
                throw new Error("NativeBridgeManager not available");
            }
            const localCb = (responseData: string) => {
                try {
                    const response = JSON.parse(responseData);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            };

            this._nativeBridge.sendEventWithCallbackEvent(
                NativeMessageEvents.buyProduct,
                productId,
                localCb
            );
        });
    }

    private async fetchWebProducts(): Promise<ProductDetails[]> {
        // Implement fetch products
        return [];
    }

    private async buyProductWeb(productId: string): Promise<any> {
        // Implement buy products for web
        return {};
    }

    private validateCall(nativeCB: Function, webCB: Function) {
        if (sys.isNative) {
            nativeCB();
        } else {
            webCB();
        }
    }

    public async helpingGetProducts(globalCB: RequestCallback) {
        try {
            this.validateCall(
                async () => {
                    const response = await this.fetchNativeProducts();
                    this.updateProductDetails(response);
                    const activeProducts = this.getActiveProducts();

                    if (activeProducts.length > 0) {
                        globalCB.success(activeProducts);
                    } else {
                        globalCB.error("Some error occurred");
                    }
                },
                async () => {
                    const webResponse = await this.fetchWebProducts();
                    // Handle web-specific response here
                }
            );
        } catch (error: any) {
            globalCB.error(error.message);
        }
    }

    public async helpingBuyProduct(
        productId: string,
        globalCB: RequestCallback
    ) {
        try {
            this.validateCall(
                async () => {
                    const response = await this.buyProductNative(productId);
                    if (response.statusCode === StatusCode.Success) {
                        console.log(
                            "Successfully purchase",
                            response.productId
                        );
                        globalCB.success(response.productId);
                    } else {
                        globalCB.error(response.message);
                    }
                },
                async () => {
                    const webResponse = await this.buyProductWeb(productId);
                    // Handle web-specific response here
                }
            );
        } catch (error: any) {
            globalCB.error(error.message);
        }
    }

    //Update product detaails
    public updateProductDetails(products: ProductNativeData[]) {
        products.forEach((element: ProductNativeData) => {
            const product: ProductDetails | undefined = this.products.find(
                (item: ProductDetails) => item.ProductId === element.productId
            );
            product && product.init(element);
        });
    }

    //getting active products
    public getActiveProducts() {
        return this.products.filter(
            (element: ProductDetails) => element.Status
        );
    }
}
