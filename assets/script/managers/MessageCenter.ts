import { Component, log, warn, _decorator, Node } from "cc";

/**
 * @title Message Center Clas
 * @author Chandan krishnani
 * @notice It is a singleton class. Message centre class used for communication other components by message passing
 */
class msgItem {
    callback: Function | null = null;
    object: Node | object | null = null;
}

const { ccclass, property } = _decorator;

@ccclass
export class MessageCenter extends Component {
    private _Que: any = null;

    private static instance: MessageCenter;

    public static getInstance(): MessageCenter {
        if (!this.instance) {
            this.instance = new MessageCenter();
        }
        return this.instance;
    }

    /**
     * Register
     * @param msg Message name
     * @param callback Callback
     * @param object Object to register
     */
    public register(msg: string, callback: Function, object: Node | object) {
        if (
            !object ||
            (!(object instanceof Node) && typeof object !== "object")
        ) {
            warn("Please pass in the correct registered object");
            return;
        }
        if (this._Que === null) {
            this._Que = {};
        }
        if (!this._Que[msg]) {
            this._Que[msg] = [];
        }

        if (this.isObjectHasRegister(msg, object)) {
            warn(
                "The object has already been registered for the message： " +
                    msg
            );
            return;
        }
        let item: msgItem = new msgItem();
        item.callback = callback;
        item.object = object;

        this._Que[msg].push(item);
    }

    /**
     *Determine whether the current object has registered the news
     * @param msg Message name
     * @param object Message object node
     */
    private isObjectHasRegister(msg: string, object: Node | object) {
        let item: msgItem[] = this._Que[msg];
        let len = item.length;
        for (let i = len - 1; i >= 0; i--) {
            if (item[i].object === object) {
                return true;
            }
        }
        return false;
    }

    /**
     * Remove object message
     * @param msg Remove message name
     * @param object Remove message object node
     */
    public unregister(msg: string, object: Node | object) {
        if (this._Que === null) {
            // console.log("_QueUninitialized");
            return;
        }
        if (!this._Que[msg]) {
            warn("Unregistered message " + msg);
            return;
        }
        let item: msgItem[] = this._Que[msg];
        let len = item.length;

        for (let i = len - 1; i >= 0; i--) {
            if (item[i].object === object) {
                item.splice(i, 1);
                break;
            }
        }
    }

    /**
     *
     * @param msg Send message name
     * @param params
     */
    public send(msg: string, params: any = null) {
        if (this._Que === null) {
            log("_Que Uninitialized/Empty");
            return;
        }
        if (!this._Que[msg]) {
            log("Message not registered: " + msg);
            return;
        }
        let callbacks = this._Que[msg];
        let len = callbacks.length;
        log("send ===> " + msg + ",Number：" + len);
        for (let i = len - 1; i >= 0; i--) {
            callbacks[i].callback(params);
        }
    }
}
