import {
    Prefab,
    Node,
    isValid,
    warn,
    _decorator,
    instantiate,
    resources,
    director,
    Asset,
    macro,
    game,
} from "cc";

const { ccclass } = _decorator;
import PopupBase from "../../components/popup/PopupBase";
import { ASSET_CACHE_MODE, PopupParams, PopupStruct } from "../constants/Popup";
/**
 * Pop -up cache mode
 */
// export enum CacheMode {
//   /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
//   Once = 1,
//   /** Normal (destroy the node immediately, but cache prefabricated resources） */
//   Normal,
//   /** Frequent (only close the node, and cache prefabricated body resources) */
//   Frequent,
// }

/**
 * Pop -up request results type
 */
enum ShowResultType {
    /** Show successfully (closed） */
    Done = 1,
    /** Show failed (failed to load） */
    Failed,
    /** Waiting (have joined the waiting queue） */
    Waiting,
}

/**ß
 * Popping window manager
 * @author Chandan Krishnani
 * @version 0.0.1
 */

@ccclass("PopupManager")
export class PopupManager {
    /**
     * Prefabrication cache
     */
    public static get prefabCache() {
        return this._prefabCache;
    }
    private static _prefabCache: Map<string, Asset> = new Map<string, Asset>();

    /**
     * Node cache
     */
    public static get nodeCache() {
        return this._nodeCache;
    }
    private static _nodeCache: Map<string, Node> = new Map<string, Node>();

    /**
     * Current pop -up request
     */
    public static get current() {
        return this._current;
    }
    private static _current: PopupRequestType | null = null;

    /**
     * Waiting for queue
     */
    public static get queue() {
        return this._queue;
    }
    private static _queue: PopupRequestType[] = [];

    /**
     * Hanging pop -up window column
     */
    public static get suspended() {
        return this._suspended;
    }
    private static _suspended: PopupRequestType[] | null = [];

    /**
     * Locking status
     */
    private static locked: boolean = false;
    public static _container: Node | null = null;
    /**
     * The container nodes used to store pop -up window nodes (if it is not set, it defaults to the current Canvas)
     */
    public static get container(): Node | null {
        return (
            this._container ||
            director.getScene()?.getChildByName("Canvas") ||
            null
        );
    }
    public static set container(value: Node | null) {
        this._container = value;
    }

    /**
     * Continuously display the time interval of pop -up window (seconds)
     */
    public static interval: number = 0.05;

    /**
     * Pop -up cache mode
     */
    public static get CacheMode() {
        return ASSET_CACHE_MODE;
    }

    /**
     * Pop -up request results type
     */
    public static get ShowResultType() {
        return ShowResultType;
    }

    /**
     * Popcopic dynamic loading starts to call back
     * @example
     * PopupManager.loadStartCallback = () => {
     *     LoadingTip.show();
     * };
     */
    public static loadStartCallback: () => void;

    /**
     * Popchen windows dynamic loading ends back
     * @example
     * PopupManager.loadFinishCallback = () => {
     *     LoadingTip.hide();
     * };
     */
    public static loadFinishCallback: () => void;

    /**
     * Show the pop -up window.
     * @Param Path pop -up window pre -pre -pre -pre -made path (such as prefabs/mypopup)
     * @param Options pop -up window options
     * @param Params pop -up display parameters
     * @example
     * const options = {
     *     title: 'Hello',
     *     content: 'This is a popup!'
     * };
     * const params = {
     *     mode: PopupCacheMode.Normal
     * };
     * PopupManager.show('prefabs/MyPopup', options, params);
     */
    public static show<Options>(
        popupSetting: PopupStruct,
        options: Options
        // params?: PopupParamsType
    ): Promise<ShowResultType> {
        return new Promise(async (res) => {
            // Analysis processing parameters
            let params: PopupParams | null = popupSetting?.params || null;
            // At present, there are already pop -up windows in the display to join the waiting queue
            console.log("this.current", this._current);
            console.log("this.locked", this.locked);
            if (this._current || this.locked) {
                // Whether to show immediately
                if (params && params.immediately) {
                    this.locked = false;
                    // Hanging the current pop -up window
                    await this.suspend();
                } else {
                    // Push the request into the waiting queue
                    params &&
                        this.push(popupSetting.path || "", options, params);
                    res(ShowResultType.Waiting);
                    return;
                }
            }
            // Save as the current pop -up window, prevent new pop -up requests
            this._current = { path: popupSetting.path, options, params };
            // It could be anything
            let node: Node = this.getNodeFromCache(popupSetting.path || "");
            // No in the cache, dynamically load prefabricated body resources
            if (!node || !isValid(node)) {
                // Start the callback
                this.loadStartCallback && this.loadStartCallback();
                // Waiting for loading
                const prefab = await this.load(popupSetting.path);
                // Complete the callback
                this.loadFinishCallback && this.loadFinishCallback();
                // Load failure (generally caused by path errors)
                console.log("isvlaid prefab", isValid(prefab));
                console.log("isvlaid prefab", prefab, popupSetting.path);
                if (!isValid(prefab)) {
                    warn(
                        "[PopupManager]",
                        "Popping window load failed",
                        popupSetting.path
                    );
                    this._current = null;
                    res(ShowResultType.Failed);
                    return;
                }
                // instantiated node
                node = <Node>(<unknown>instantiate(prefab));
            }
            console.log("Node we have", node);
            // Get a pop -up component inherited from PopupBase
            const popup: PopupBase | null = node?.getComponent(PopupBase);

            if (!popup) {
                warn(
                    "[PopupManager]",
                    "No pop -up component was found",
                    popupSetting.path
                );
                this._current = null;
                res(ShowResultType.Failed);
                return;
            }
            // Save component reference
            this._current && (this._current.popup = popup);
            // Save node reference
            this._current && (this._current.node = node);
            // Add to the scene
            node.setParent(this.container);
            // Show at the top level
            // node.setSiblingIndex(game.getMaxZIndex());
            // Set up to complete the callback
            // @ts-ignore
            popup.finishCallback = async (suspended: boolean) => {
                console.log("Finished call recived", suspended);
                if (suspended) {
                    return;
                }
                // Whether to lock
                this.locked =
                    (this._suspended && this._suspended.length > 0) ||
                    this._queue.length > 0;
                // Recycle
                this.recycle(popupSetting.path, node, params?.mode);
                this._current = null;
                res(ShowResultType.Done);
                // Delay for a while

                await new Promise((_res) => {
                    setTimeout(_res, this.interval);
                    //   this.scheduleOnce(_res, this.interval); //Checking for the issue
                });
                // );
                // Next pop -up window

                this.next();
            };
            // exhibit
            popup?.show(options);
            console.log("the queue ", this._suspended);
            console.log("the queue ", this._queue);
        });
    }

    /**
     * Hide the current pop -up window
     */
    public static hide() {
        if (isValid(this._current?.popup)) {
            this._current?.popup?.hide();
        }
    }

    /**
     * Get the node from the cache
     * @param path Pop -up path
     */
    private static getNodeFromCache<T extends Node | Asset | null>(
        path: string
    ): T {
        // Get from the node cache
        const nodeCache = this._nodeCache;
        if (nodeCache.has(path)) {
            const node = nodeCache.get(path);
            if (isValid(node)) {
                return node as T;
            }
            // Delete invalid reference
            nodeCache.delete(path);
        }
        // Get from the prefabrication cache
        const prefabCache = this._prefabCache;
        if (prefabCache.has(path)) {
            const prefab = prefabCache.get(path);
            if (isValid(prefab)) {
                // Add reference count
                prefab?.addRef();
                // Instantiated and returned

                return instantiate(prefab) as T;
            }
            // Delete invalid reference
            prefabCache.delete(path);
        }
        // none
        return null as T;
    }

    /**
     * Show pending or waiting for the next popup in the queue
     */
    private static next() {
        if (
            this._current ||
            (this._suspended?.length === 0 && this._queue.length === 0)
        ) {
            return;
        }

        // Take out a request
        let request: PopupRequestType | null = null;
        if (this._suspended && this._suspended.length > 0) {
            // Linked queue
            request = this._suspended.shift() || null;
        } else {
            // Wait for queue
            request = this._queue.shift() || null;
        }
        // unlock
        this.locked = false;
        // Existing examples
        if (isValid(request?.popup)) {
            // Set to the current pop -up window
            this._current = request;
            // Display directly
            request?.node?.setParent(this.container);
            request?.popup?.show(request?.options);
            return;
        }
        // Load and display
        let settings: PopupStruct = {
            path: request?.path || "",
            params: request?.params || null,
        };
        console.log("the queue we have", this._suspended);
        console.log("the queue we have", this._queue);
        this.show(settings, request?.options);
    }

    /**
     * Add a pop -up request to the waiting queue. If there is no pop -up window in the display, the pop -up window is directly displayed.
     * @Param Path pop -up window pre -pre -pre -pre -made path (such as prefabs/mypopup)
     * @param Options pop -up window options
     * @param Params pop -up display parameters
     */
    private static push<Options>(
        path: string,
        options: Options,
        params: PopupParams
    ) {
        // Display directly
        if (!this._current && !this.locked) {
            let settings: PopupStruct = {
                path: path,
                params: params,
            };
            this.show(settings, options);
            return;
        }
        // Join the queue
        this._queue.push({ path, options, params });
        // Sort by priority from small to large
        this._queue.sort((a, b) => {
            if (a.params && b.params) {
                return a.params.priority - b.params.priority;
            }
            return 0;
        });
    }

    /**
     * Hanging the pop -up window in the current display
     */
    private static async suspend() {
        if (!this._current) {
            return;
        }
        const request = this._current;

        console.log("Popup suspended called");
        // Push the current pop -up window to hang the queue
        this._suspended?.push(request);
        // @ts-ignore
        await request.popup.onSuspended();
        // Close the current pop -up window (hanging)
        await request.popup?.hide(true);
        // Putting on the current
        this._current = null;
    }

    /**
     * Recycling pop -up window
     * @param Path pop -up path
     * @param Node pop -up window node
     * @param Mode cache mode
     */
    private static recycle(
        path: string,
        node: Node,
        mode: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Once
    ) {
        switch (mode) {
            // One -time
            case ASSET_CACHE_MODE.Once: {
                this._nodeCache.delete(path);
                node.destroy();
                // freed
                this.release(path);
                break;
            }
            // normal
            case ASSET_CACHE_MODE.Normal: {
                this._nodeCache.delete(path);
                node.destroy();
                break;
            }
            // frequently
            case ASSET_CACHE_MODE.Frequent: {
                node.removeFromParent();
                this._nodeCache.set(path, node);
                break;
            }
        }
    }

    /**
     * Load and cache the pop -up pre -pre -made body resources
     * @param Path pop -up path
     */
    public static load(path: string): Promise<Prefab | Asset | undefined> {
        return new Promise((res) => {
            const prefabMap = this._prefabCache;
            // See if there is any in the cache, avoid repeated loading
            if (prefabMap.has(path)) {
                const prefab = prefabMap.get(path);
                // Whether the cache is effective
                if (isValid(prefab)) {
                    res(prefab);
                    return;
                } else {
                    // Delete invalid reference
                    prefabMap.delete(path);
                }
            }

            // Dynamic load
            resources.load(path, (error: Error | null, prefab: Asset) => {
                if (error) {
                    res(undefined);
                    return;
                }
                console.log("Error loadingprefab", error);

                prefabMap.set(path, prefab);
                // return
                res(prefab);
            });
        });
    }

    /**
     * Try to release the pop -up resource (note: please release the resource loaded in the pop -up window)
     * @param path Pop -up path
     */
    public static release(path: string) {
        // Remove nodes
        const nodeCache = this._nodeCache;
        let node: Node | undefined = nodeCache.get(path);
        if (node) {
            nodeCache.delete(path);
            if (isValid(node)) {
                node.destroy();
            }
            node = undefined;
        }
        // Remove the prefabrication
        const prefabCache = this._prefabCache;
        let prefab = prefabCache.get(path);
        if (prefab) {
            // Delete cache
            if (prefab.refCount <= 1) {
                prefabCache.delete(path);
            }
            // Reduce reference
            prefab.decRef();
            prefab = undefined;
        }
    }

    /**
     * Analysis parameter
     * @param Params parameters
     */
    private static parseParams(params: PopupParamsType) {
        if (params == undefined) {
            return new PopupParamsType();
        }
        // Whether to
        if (Object.prototype.toString.call(params) !== "[object Object]") {
            warn(
                "[PopupManager]",
                "The pop -up parameters are invalid, using the default parameter"
            );
            return new PopupParamsType();
        }
        // Cache mode
        if (params.mode == undefined) {
            params.mode = ASSET_CACHE_MODE.Normal;
        }
        // priority
        if (params.priority == undefined) {
            params.priority = 0;
        }
        // Immediately show
        if (params.immediately == undefined) {
            params.immediately = false;
        }
        return params;
    }
}

/**
 * Popping window display parameter type
 */
class PopupParamsType {
    /** Cache mode */
    mode?: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Normal;
    /** Priority (priority priority display) */
    priority?: number = 0;
    /** Show immediately (will hang the pop -up window in the current display) */
    immediately?: boolean = false;
}

/**
 * Pop -up display request type
 */
class PopupRequestType {
    /** Practical prefabricated path */
    path?: string;
    /** Pop -up option */
    options: any;
    /** Cache mode */
    params?: PopupParams | null;
    /** Pop -up component */
    popup?: PopupBase;
    /** Pop -up node */
    node?: Node;
}
