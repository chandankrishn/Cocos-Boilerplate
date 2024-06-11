import { _decorator, Component, native, Node, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("NativeCallManager")
export class NativeCallManager extends Component {
    private static _instance: NativeCallManager | null = null;

    public static get Instance() {
        if (!NativeCallManager._instance) {
            NativeCallManager._instance = new NativeCallManager();
        }
        return NativeCallManager._instance;
    }

    // Calls a native function based on the operating system
    public callNativeFunction() {
        if (sys.os === sys.OS.IOS) {
            // Call the native function "downLoadZip:andContent:" in the "AppDelegate" class
            let returnValue = native.reflection.callStaticMethod(
                "AppDelegate", // class name "AppDelegate"
                "downLoadZip:andContent:", // function name "downloadZip"
                `param1`, // parameter 1
                `param2` // parameter 2
            );
        } else {
            // Call the native function "ZipDownload" in the "com/cocos/game/AppActivity" class
            native.reflection.callStaticMethod(
                "com/cocos/game/AppActivity", // class name "AppActivity"
                "ZipDownload", // function name "zipdownloader"
                "(Ljava/lang/String;)V", // parameter type and return type
                `param1` // parameter 1
            );
        }
    }
}
