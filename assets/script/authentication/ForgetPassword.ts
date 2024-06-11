import { _decorator, Component, EditBox, Label, log, Node } from "cc";
import { API_END_POINTS, REQUEST_TYPE, SERVER } from "../../script/managers/NetworkConfig";
import { NetworkManager } from "../../script/managers/NetworkManager";
import { PopupManager } from "../../script/managers/PopupManager";
import PopupBase from "../../components/popup/PopupBase";
import { POPUPS } from "../../script/constants/Popup";
import { GameManager } from "../../script/managers/GameManager";
import { ERROR_MSG } from "../../script/comman/Strings";
import { FieldValidator } from "../../script/comman/FieldValidator";
const { ccclass, property } = _decorator;

@ccclass("ForgetPassword")
export class ForgetPassword extends PopupBase {
    @property({ type: Label })
    emailLabel: Label = null!;
    @property({ type: EditBox, displayName: "Email Editbox" }) emailEb = new EditBox();
    @property({ type: EditBox, displayName: "newPassword Editbox" }) newPassword = new EditBox();
    @property({ type: EditBox, displayName: "otp EditBox" }) otpEb = new EditBox();
    start() {
        this.emailLabel.string = "";//gameData.getInstance().Email;
    }
    checkValidation() {
        // let isUserNameValid = this.emailEb.getComponent(FieldValidator)!.doValidation(this.emailEb.string.trim());
        let isPasswordValid = this.newPassword.getComponent(FieldValidator)!.doValidation(this.newPassword.string);
        let isEmailValid = this.emailEb
            .getComponent(FieldValidator)!
            .doValidation(this.emailEb.string.toLowerCase().trim());
        console.log("after validation checl ", isEmailValid.isValid, isPasswordValid.isValid, this.otpEb.string.length);

        if (isEmailValid.isValid && isPasswordValid.isValid && this.otpEb.string.length >= 4) {
            this.passwordResert();
        }
    }
    otpREq() {
        console.log("email ", this.emailEb.string.toLowerCase().trim());
        // ApiCalls.Instance.otpRequest(this.emailEb.string.toLowerCase().trim());
    }
    closeBtn() {
        this.node.active = false;
        PopupManager.show(POPUPS.LOGIN, {});
    }
    loginComplete() {
        PopupManager.show(POPUPS.LOGIN, {});
        this.hide();
        // this.node.destroy();
    }

    protected updateDisplay(options: any): void {
        this.emailEb.string = options.email;
    }
    passwordResert() {
        let user = {
            email: this.emailEb.string.toLowerCase().trim(),
            otp: this.otpEb.string,
            password: this.newPassword.string,
        };
        console.log("response sent");

        let onSuccess = (data) => {
            data = JSON.parse(data);
            GameManager.Instance.PersistNodeRef.showSnackBar(data.status.message, 2, 1);
            console.log("password resert complete", data);
            this.loginComplete();
        };
        let onError = (data = null) => {
            // data = JSON.parse(data);
            // console.log("error duringpassword resert", data.error);
        };

        NetworkManager.getInstance().sendRequest(
            API_END_POINTS.RESET_PASSWORD,
            REQUEST_TYPE.POST,
            user,
            onSuccess,
            onError,
            false
        );
    }

    update(deltaTime: number) { }
}
