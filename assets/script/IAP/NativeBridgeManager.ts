import { native, sys } from "cc";
import { NativeMessageEvents, Event } from "./Constant";
import { ProductDetails } from "./ProductDetails";

/**
 * Native bridge for all subscribed and events for any platform so that can add custom checks accordingly
 * @author Chandan Krishnani
 * @version 0.0.1
 */
export class NativeBridgeManager {
    /**
     *  Function to encode data from array of object
     * @param data array of object can be encoded for format go to constants
     * @param key
     * @returns
     */

    private _eventsRegistered: Map<string, string> | null = null;

    /**
     * In case you want to unsubscribe any event
     * @param eventname name of event
     * @returns
     */
    public unsubscibeEvents(eventname: string): Boolean {
        if (eventname) return false;
        if (this._eventsRegistered?.has(eventname)) {
            native.jsbBridgeWrapper.removeAllListenersForEvent(eventname);
            this._eventsRegistered.delete(eventname);
            return true;
        }
        return false;
    }

    /**
     * Removing all event for that specific event
     */
    public unsubscribeAllEvents() {
        this._eventsRegistered?.clear();
        native.jsbBridgeWrapper.removeAllListeners();
    }

    public encodeDataFromArrayOfObject(data: any[], key: string): string {
        if (!data.length || !key) return ""; //base condition

        let stringData: string = ""; //Comma seprated string for data
        data.forEach((element, index: number) => {
            stringData += element[key]; //Appending index
            console.log("string", stringData);
            stringData = stringData + (data.length - 1 == index ? "" : ","); //Appending comma and check for last index
        });
        //Retuning string
        console.log("string", stringData);
        return stringData;
    }

    public sendEvent(event: string, args?: string) {
        native.jsbBridgeWrapper.dispatchEventToNative(event, args);
    }

    /**
     * Function to send native event
     * @param eventKey Event key for response and request
     * @param args arg to be send
     * @param callback callback for the reuest
     */
    public sendEventWithCallbackEvent(
        eventKey,
        args: string,
        callback: (data: string) => void
    ) {
        //Callback listner for event request event
        native.jsbBridgeWrapper.addNativeEventListener(
            eventKey.response,
            (data) => {
                native.jsbBridgeWrapper.removeAllListenersForEvent(
                    eventKey.response
                ); //Removing event callback to handle error
                callback(data);
            }
        );

        // Event dispatcher for the same event
        native.jsbBridgeWrapper.dispatchEventToNative(eventKey.request, args);
    }
}
