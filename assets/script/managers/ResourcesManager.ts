import {
  _decorator,
  Asset,
  AudioClip,
  isValid,
  Node,
  Prefab,
  resources,
  SpriteFrame,
  warn,
} from "cc";
import { ASSET_CACHE_MODE } from "../constants/Popup";
const { ccclass, property } = _decorator;
type AssetType = AudioClip | SpriteFrame | Prefab;
@ccclass("ResourcesManager")
export class ResourcesManager {
  // * Resources which you have loaded and want to access
  private static _resourceCache: Map<string, AssetType> = new Map<string, AssetType>();

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

  private static getAssetFromCache(path: string): AssetType {
    const resourceMap = this.resourceCache;
    if (resourceMap.has(path)) {
      const asset = resourceMap.get(path);
      return asset;
    }
    return null;
  }

  private static getNodeFromCache(path: string): Node | null {
    const resourceMap = this.nodeCache;
    if (resourceMap.has(path)) {
      const asset = resourceMap.get(path);
      return asset;
    }
    return null;
  }

  /**
   * Function to load resource and load in cache
   * @param  Path of resource need to load fro resources folder
   * @param type
   */
  public static loadResource<T extends AssetType>(
    path: string,
    cacheMode: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Normal
  ): Promise<T> {
    return new Promise((res) => {
      //If asset has been previously loaded
      const asset = ResourcesManager.getAssetFromCache(path);
      if (asset) {
        res(asset as T);
        return;
      }

      // If it is being loaded first time and setted up to map
      resources.load(path, (err: Error, data: AssetType) => {
        if (err) {
          warn("Some error occurred ::  ", err);
          res(null);
          return;
        }

        const resourceMap = ResourcesManager.resourceCache;
        if (ASSET_CACHE_MODE.Once != cacheMode) resourceMap.set(path, data);
        res(data as T);
      });
    });
  }

  /**
   * Get the resource from cache for resources
   */
  public getResourceFromCache(path: string): Node | Asset | null {
    const node = ResourcesManager.getNodeFromCache(path);
    if (isValid(node)) {
      return node;
    }

    const prefabCache = ResourcesManager.getAssetFromCache(path);
    if (prefabCache) {
      return prefabCache;
    }
    return null;
  }

  /**
   * Recycle the resouce for resuse pupose
   */
  public static recycleResource(path: string, asset: Node, mode: ASSET_CACHE_MODE) {
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
    let node = this._nodeCache.get(path);
    if (node) {
      if (isValid(node)) {
        node.destroy();
      }
      node = null;
      this._nodeCache.delete(path);
    }

    //Remove prefabriction

    let prefab = this._resourceCache.get(path);
    if (prefab) {
      //Delete cahce
      if (prefab.refCount <= 1) {
        this._resourceCache.delete(path);
      }

      //Reduce refrences
      prefab.decRef();
      prefab = null;
    }
  }

  /**
   * Relase all and destroy all nodes and release memory
   */
  public static releaseNodeCache(): void {
    this._nodeCache.forEach((value, key, map) => {
      if (isValid(value)) {
        value.destroy();
      }
      value = null;
    });
    this._nodeCache.clear();
  }
}
