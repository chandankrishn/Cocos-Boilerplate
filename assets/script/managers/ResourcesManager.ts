import {
    _decorator,
    Asset,
    AudioClip,
    isValid,
    Node,
    path,
    Prefab,
    resources,
    SpriteFrame,
    warn,
} from "cc";
import { ASSET_CACHE_MODE } from "../constants/Popup";
const { ccclass, property } = _decorator;
type AssetType = AudioClip | SpriteFrame | Prefab | SpriteFrame[] | null;
@ccclass("ResourcesManager")
export class ResourcesManager {
    // * Resources which you have loaded and want to access
    private static _resourceCache: Map<string, Asset> = new Map<
        string,
        Asset
    >();

    // * Node which you want to access frequently
    private static _nodeCache: Map<string, Node> = new Map<string, Node>();

    /**
     * Getter and setter for node cache
     */
    public static get resourceCache() {
        return this._resourceCache;
    }

    public static get nodeCache() {
        return this._nodeCache;
    }

    private static getAssetFromCache(path: string): Asset | undefined {
        const resourceMap = this.resourceCache;
        console.log("Resource map", resourceMap);
        console.log("Resource map", path);
        if (resourceMap.has(path)) {
            const asset = resourceMap.get(path);
            return asset;
        }
        return;
    }

    private static getNodeFromCache(path: string): Node | undefined {
        const resourceMap = this.nodeCache;
        if (resourceMap.has(path)) {
            const asset = resourceMap.get(path);
            return asset;
        }
        return;
    }

    /**
     * Function to load resource and load in cache
     * @param  Path of resource need to load fro resources folder
     * @param type
     */
    public static loadArrayOfResource<T extends { [key: string]: Asset }>(
        paths: { [key: string]: string }[],
        cacheMode: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Normal,
        progressCallback?: (progress: number) => void
    ): Promise<T> {
        return new Promise((res) => {
            //If asset has been previously loaded

            const loadedAssets: { [key: string]: Asset } = {};
            const length = paths.length;
            let assetName: string[] = [];

            //check for available resources else load it from chache
            for (let index = 0; index < paths.length; index++) {
                const cachedAssets = ResourcesManager.getAssetFromCache(
                    Object.keys(paths[index])[0]
                );
                //If we have a chaced asset
                if (cachedAssets) {
                    loadedAssets[Object.keys(paths[index])[0]] = cachedAssets;
                    paths.splice(index, 1);
                    --index;
                } else {
                    assetName.push(...Object.values(paths[index]));
                }
            }

            if (Object.keys(loadedAssets).length === length) {
                res(loadedAssets as T);
                return;
            }

            // If it is being loaded first time and setted up to map
            resources.load(
                assetName,
                (finished, total, item) => {
                    const progress = finished / total;
                    progressCallback && progressCallback(progress);
                },
                (err: Error | null, data: Asset[]) => {
                    if (err) {
                        warn("Some error occurred ::  ", err);
                        // res(null);
                        return;
                    }

                    const resourceMap = ResourcesManager.resourceCache;
                    data.forEach((value: Asset, index) => {
                        loadedAssets[value.name] = value;
                        if (ASSET_CACHE_MODE.Once != cacheMode)
                            resourceMap.set(value.name, value);
                    });

                    res(loadedAssets as T);
                }
            );
        });
    }

    public static loadResource<T extends Asset | null>(
        path: string,
        cacheMode: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Normal,
        progressCallback?: (progress: number) => void
    ): Promise<T> {
        return new Promise((res) => {
            const asset = ResourcesManager.getAssetFromCache(path);
            if (asset) {
                res(asset as T);
                return;
            }
            resources.load([path], null, (err: Error | null, data: Asset[]) => {
                if (err) {
                    warn("Some error occurred ::  ", err);
                    // res(null);

                    return;
                }
                const resourceMap = ResourcesManager.resourceCache;
                if (ASSET_CACHE_MODE.Once != cacheMode)
                    resourceMap.set(path, data[0]);
                res(data[0] as T);
            });
        });
    }

    /**
     * Get the resource from cache for resources
     */
    public getResourceFromCache(path: string): Asset | Node | undefined {
        const node = ResourcesManager.getNodeFromCache(path);
        if (isValid(node)) {
            return node;
        }

        const prefabCache = ResourcesManager.getAssetFromCache(path);
        if (prefabCache) {
            return prefabCache;
        }
        return;
    }

    /**
     * Recycle the resouce for resuse pupose
     */
    public static recycleResource(
        path: string,
        asset: Node,
        mode: ASSET_CACHE_MODE
    ) {
        switch (mode) {
            case ASSET_CACHE_MODE.Once: {
                this.release(path);
                break;
            }
            case ASSET_CACHE_MODE.Normal: {
                this._nodeCache.delete(path);
                asset.destroy();
                break;
            }
            case ASSET_CACHE_MODE.Frequent: {
                asset.removeFromParent();
                this._nodeCache.set(path, asset);
                break;
            }
        }
    }

    /**
     * Release the resporces
     * @param path Path to asset
     */
    public static release(path: string) {
        let node: Node | undefined = this._nodeCache.get(path);
        if (node) {
            if (isValid(node)) {
                node.destroy();
            }
            node = undefined;
            this._nodeCache.delete(path);
        }

        //Remove prefabriction

        let prefab = this._resourceCache.get(path);
        if (prefab) {
            //Delete cahce
            this._resourceCache.delete(path);
            // if (prefab.refCount <= 1) {
            // }

            //Reduce refrences
            prefab?.decRef();
            // typeof prefab == typeof Prefab && prefab?.decRef();
            prefab = undefined;
        }
    }

    /**
     * Relase all and destroy all nodes and release memory
     */
    public static releaseNodeCache(): void {
        this._nodeCache.forEach((value: Node | null, key, map) => {
            if (isValid(value) && value) {
                value.destroy();
            }
            value = null;
        });
        this._nodeCache.clear();
    }
}
