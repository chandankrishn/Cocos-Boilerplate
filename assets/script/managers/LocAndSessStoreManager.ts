import { warn } from "cc";
import { SoundManager } from "./SoundManager";
/**
 * Local Storage manager so that each time to get a specific key does not need to access local storage
 * @author Chandan Krishnani
 * @version 0.0.1
 */

export enum STORAGE {
  LOCAL,
  SESSION,
}
export class LocAndSessStoreManager {
  //Singleton instance
  private static _instance: LocAndSessStoreManager = null;

  //Data cache so that no need to access localstorage again and again
  private _dataCache: Map<string, string> = new Map<string, string>();

  public static getInstance() {
    if (!LocAndSessStoreManager._instance) {
      LocAndSessStoreManager._instance = new LocAndSessStoreManager();
    }
    return LocAndSessStoreManager._instance;
  }

  public get dataCache() {
    return this._dataCache;
  }

  /**
   *Function to get data from cahche or localstorage
   * @param key Key to get It will check in the available of cache for key if found fine or it will check in localstorage
   * @returns
   */

  public getData(key: string, storageType: STORAGE = STORAGE.LOCAL) {
    //check if is available in data cache
    const dataCache = this.dataCache;
    if (dataCache.has(key)) return dataCache.get(key);

    let data;
    //Check if it is available in local or session
    if (storageType == STORAGE.LOCAL) data = localStorage.getItem(key);
    else data = sessionStorage.getItem(key);

    //IF we have mistakenly passed local storage instead of session
    if (data) {
      dataCache.set(key, data);
      return key;
    } else {
      data = sessionStorage.getItem(key);
      if (data) {
        dataCache.set(key, data);
        return key;
      }
    }
    warn("No key avaialable ::  ", key);
    return null;
  }
  /**
   *  Setter for data to map key with data
   * @param key key to access data
   * @param data data for the same
   */
  public setData(key: string, data: string, storageType: STORAGE = STORAGE.LOCAL) {
    const dataCache = this.dataCache;
    dataCache.set(key, data);
    //checking for local and seession storage to store
    switch (storageType) {
      case STORAGE.LOCAL:
        localStorage.setItem(key, data);
        break;
      case STORAGE.SESSION:
        sessionStorage.setItem(key, data);
        break;
    }
  }
}
