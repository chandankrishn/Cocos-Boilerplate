import { SESSION_STORAGE } from "../constants/Constant";
import { LocAndSessStoreManager } from "./LocAndSessStoreManager";
import { DEPLOYMENT_MODE, BASE_ADDRESS, API_TEST_KEYS } from "./NetworkConfig";
export class NetworkManager {
  private static _instance: NetworkManager;
  private baseUrl: string = "";
  private apiTestKey: string = "";

  static getInstance(): NetworkManager {
    if (!NetworkManager._instance) {
      NetworkManager._instance = new NetworkManager();
    }
    return NetworkManager._instance;
  }

  init(deplaymentMode: DEPLOYMENT_MODE) {
    switch (deplaymentMode) {
      case DEPLOYMENT_MODE.LOCAL:
        this.baseUrl = BASE_ADDRESS.LOCAL;
        this.apiTestKey = API_TEST_KEYS.LOCAL;
        break;
      case DEPLOYMENT_MODE.DEVELOPMENT:
        this.baseUrl = BASE_ADDRESS.DEVELOPMENT;
        this.apiTestKey = API_TEST_KEYS.DEVELOPMENT;
        break;
      case DEPLOYMENT_MODE.PRODUCTION:
        this.baseUrl = BASE_ADDRESS.PRODUCTION;
        break;
      case DEPLOYMENT_MODE.STAGING:
        this.baseUrl = BASE_ADDRESS.STAGING;
        this.apiTestKey = API_TEST_KEYS.STAGING;
        break;
    }
  }

  sendRequest(
    api: string,
    reuqestType: string,
    param: any,
    successCb: Function,
    errorCb: Function,
    requireToken: boolean = false
  ) {
    let xhr = new XMLHttpRequest();
    //Setting up response type javascript object by default it is string
    xhr.responseType = "json";

    let fullurl = this.baseUrl + api;

    let readyStateChanged = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        let response: any = xhr.response;
        successCb(response.data);
      } else if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status < 500) {
        let respone: string = xhr.responseText;
        errorCb(respone);
      }
    };
    xhr.open(reuqestType, fullurl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-API-KEY", this.apiTestKey);
    if (requireToken)
      xhr.setRequestHeader(
        "authorization",
        LocAndSessStoreManager.getInstance().getData(SESSION_STORAGE.TOKEN)
      );

    xhr.onreadystatechange = readyStateChanged;
    xhr.send(JSON.stringify(param));
  }

  sendGetWithQueryString(
    api: string,
    reuqestType: string,
    param: any,
    successCb: Function,
    errorCb: Function,
    requireToken: boolean = false
  ) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    let fullurl = this.getInitialBaseURL() + api;
    let readyStateChanged = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        let response: any = xhr.response;
        successCb(response?.data);
      } else if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status < 500) {
        let respone: string = xhr.response;
        errorCb(respone);
      }
    };
    var queryString = this.objectToQueryString(param);
    xhr.open(reuqestType, fullurl + "?" + queryString, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (requireToken)
      xhr.setRequestHeader(
        "Authorization",
        LocAndSessStoreManager.getInstance().getData(SESSION_STORAGE.TOKEN)
      );
    // xhr.setRequestHeader(AUTH.GAME_ID,sessionStorage.getItem(AUTH.GAME_ID));

    xhr.setRequestHeader("X-API-KEY", this.apiTestKey);
    xhr.onreadystatechange = readyStateChanged;
    xhr.send(null);
  }

  objectToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getInitialBaseURL(): string {
    return this.baseUrl;
  }
}
