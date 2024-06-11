import {
    _decorator,
    Component,
    Node,
    Label,
    Animation,
    Vec3,
    Widget,
} from "cc";
const { ccclass, property } = _decorator;

export enum LoaderType {
    FULL_SCREEN = "Full_Screen",
    ONLY_MESSAGE = "ONLY_MESSAGE",
}

/**
 * @title PopUp class
 * @author Chandan krishnani
 * @notice this class manages the popUps.
 */
@ccclass("CircularLoader")
export class CircularLoader extends Component {
    @property(Node) message: Node = null!;
    @property(Node) circle: Node = null!;
    start() {
        console.log("hello are you");
    }

    onLoad() {
        // this.node.active = false;
    }

    /**
     * @en
     * Use startTimer to start the timer,
     * It will end automatically and calls callback function on time over
     * @param msgString  Message to be displayed on the PopUp
     * @param func  The callback function which will be called on cross buttons callback.
     */
    showLoader(type: LoaderType = LoaderType.FULL_SCREEN, msgString: string = "") {
        switch (type) {
            case LoaderType.FULL_SCREEN: {
                this.circle.active = true;
                // this.message.active = false;
                break;
            }
            case LoaderType.ONLY_MESSAGE: {
                this.circle.active = false;
                break;
            }
        }
        // console.log("aniamtion played ");

        this.node.active = true;
        // this.message.getComponent(Label).string = msgString;
    }
    onEnable() {
        this.circle?.getComponent(Animation)?.play();
    }

    stopLoader() {
        this.node.active = false;
        this.circle.getComponent(Animation)?.stop();
    }
}
