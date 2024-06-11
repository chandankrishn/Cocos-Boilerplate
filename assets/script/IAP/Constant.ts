// Event interface supporting interface for native message events
export interface Event {
    request: string;
    response: string;
}

// Status code same as recieved from native
export enum StatusCode {
    Success = "200",
    Error = "404",
    EmptyList = "400",
}

// Message passing events for native if it is callback event format should be same
export const NativeMessageEvents: { [key: string]: Event | string } = {
    fetchProducts: {
        response: "fetchProductsResponse",
        request: "fetchProductsRequest",
    },

    buyProduct: {
        response: "buyProductResponse",
        request: "buyProductRequest",
    },
};

// Request callback of success and error
export interface RequestCallback {
    success: (data) => void;
    error: (data) => void;
}

// Reward interface supporting product details and products constants if need to app further more reward
export interface Reward {
    type: rewardType;
    coin?: string;
    bomb?: string;
    fireBall?: string;
}

// Product Native data
export interface ProductNativeData {
    productId: string;
    title: string;
    formattedPrice: string;
}

export interface Product {
    productId: string;
    reward: Reward;
}

export enum rewardType {
    Single,
    Multiple,
}

export const IAPProducts: Product[] = [
    {
        productId: "com.frimustechnologies.bubbleshooter.50coins",
        reward: {
            type: rewardType.Single,
            coin: "50",
        },
    },
    {
        productId: "com.frimustechnologies.bubbleshooter.50gems",
        reward: {
            type: rewardType.Multiple,
            coin: "50",
            bomb: "5",
            fireBall: "4",
        },
    },
];
