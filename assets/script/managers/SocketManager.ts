import { _decorator, Component, Node } from "cc";
import io from "socket.io-client/dist/socket.io.js";

import { DEPLOYMENT_MODE, SOKCET_URLS, SOCKET_EVENTS } from "./NetworkConfig";
const { ccclass, property } = _decorator;

@ccclass("SocketManager")
export class SocketManager {
  private static _instance: SocketManager;
  private socket = null;
  private socketUrl: string = "";
  private socketConfig = {
    reconnectionDelayMax: 10000,
  };

  public static getInstance() {
    if (!SocketManager._instance) {
      SocketManager._instance = new SocketManager();
    }
    return SocketManager._instance;
  }

  init(deplaymentMode: DEPLOYMENT_MODE, params: string) {
    switch (deplaymentMode) {
      case DEPLOYMENT_MODE.LOCAL:
        this.socketUrl = `${SOKCET_URLS.LOCAL}?${params}`;
        break;
      case DEPLOYMENT_MODE.DEVELOPMENT:
        this.socketUrl = `${SOKCET_URLS.DEVELOPMENT}?${params}`;
        break;
      case DEPLOYMENT_MODE.PRODUCTION:
        this.socketUrl = `${SOKCET_URLS.PRODUCTION}?${params}`;
        break;
      case DEPLOYMENT_MODE.STAGING:
        this.socketUrl = `${SOKCET_URLS.STAGING}?${params}`;
        break;
    }
    if (!this.socket) {
      this.connect();
    }
  }

  connect() {
    this.socket = io(this.socketUrl, this.socketConfig);
    this.socket.on(SOCKET_EVENTS.Connect, function () {
      console.log("******** socket connected sucessfully ********");
    });
    this.socket.on(SOCKET_EVENTS.Error, function (error) {
      // console.log("******** socket connection error ******** :");
      // console.log(error);
    });
    // this.socket.on(SOCKET_EVENTS.Disconnect, function () {
    //     console.log("******** socket disconnected sucessfully ********");
    // });
    this.socket.on(SOCKET_EVENTS.Reconnect, function () {
      // console.log("******** socket reconnected sucessfully ********");
    });
    this.socket.on(SOCKET_EVENTS.Reconnecting, function (msg) {
      // console.log("******** socket Reconnecting successfully ******** :" + msg.toString());
    });
    this.socket.on(SOCKET_EVENTS.Message, function (data) {
      // console.log("******** socket message received ******** :" + data.toString());
    });
  }

  disconnect() {
    this.socket.disconnect();
    this.socket = null;
  }

  isSocketConnected() {
    return this.socket && this.socket.connected;
  }

  emitCutomEvent(eventName: string, eventData: Object = {}, fn: Function) {
    if (this.isSocketConnected()) {
      // console.log("Event emmited", eventName);
      this.socket.emit(eventName, eventData, fn);
    }
  }

  subscribeEvent(eventName: string, fn: Function) {
    // console.log("subscrtiebe to event", eventName);
    this.socket.on(eventName, fn);
  }

  unSubscribeEvent(eventName: string, fn: Function) {
    // console.log("unSubscrtiebe to event", eventName);
    this.socket.off(eventName, fn); // ("details", listener);
  }

  closeSocket() {
    if (this.socket) this.socket.close();
  }
}
