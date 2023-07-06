import { PopupManager } from "../managers/PopupManager";
export enum POPUP_PRIORITY {
    LOW = 0,
    HIGH = 1,
    MEDIUM = 2,
}
export interface PopupStruct {
    // Path of Popup
    path: string;
    params: PopupParams | null;
}
export enum ASSET_CACHE_MODE {
    /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
    Once = 1,
    /** Normal (destroy the node immediately, but cache prefabricated resources） */
    Normal,
    /** Frequent (only close the node, and cache prefabricated body resources) */
    Frequent,
}

export interface PopupParams {
    //Cache Mode of popup like ( Normal , once and frequent )
    mode: ASSET_CACHE_MODE;
    //Priority of popup to be opened
    priority: POPUP_PRIORITY;
    //Popup true if
    immediately: boolean;
}

export const POPUPS: Record<string, PopupStruct> = {
    SETTINGS: {
        path: "prefabs/settingsPopup",
        params: {
            mode: ASSET_CACHE_MODE.Normal,
            priority: POPUP_PRIORITY.HIGH,
            immediately: false,
        },
    },
    TEST1: {
        path: "prefabs/settingsPopup-3",
        params: {
            mode: ASSET_CACHE_MODE.Frequent,
            priority: POPUP_PRIORITY.HIGH,
            immediately: true,
        },
    },
    TEST2: {
        path: "prefabs/settingsPopup2",
        params: {
            mode: ASSET_CACHE_MODE.Frequent,
            priority: POPUP_PRIORITY.MEDIUM,
            immediately: false,
        },
    },
    TEST3: {
        path: "prefabs/settingsPopup2",
        params: {
            mode: ASSET_CACHE_MODE.Frequent,
            priority: POPUP_PRIORITY.HIGH,
            immediately: true,
        },
    },
};
/**
 * Pop -up cache mode
 */
