import { _decorator, Component, EditBox } from "cc";
import { API_END_POINTS, REQUEST_TYPE, SERVER } from "../../script/managers/NetworkConfig";
import { NetworkManager } from "../../script/managers/NetworkManager";
import { PopupManager } from "../../script/managers/PopupManager";
import PopupBase from "../../components/popup/PopupBase";
import { POPUPS } from "../../script/constants/Popup";
import { GameManager } from "../../script/managers/GameManager";
import { ERROR_MSG } from "../../script/comman/Strings";
import { FieldValidator } from "../../script/comman/FieldValidator";
// import { persistNode } from '../../persistNode';
const { ccclass, property } = _decorator;

@ccclass("login")
export class load extends PopupBase {
    @property({ type: EditBox, displayName: "Email Editbox" }) emailEb = new EditBox();
    @property({ type: EditBox, displayName: "Password Editbox" }) passwordEb = new EditBox();

    onLoad() { }
    loginBtnClick() {
        // this.selectMode();
        if (!this.checkValidation()) {
            return;
        } else {
            let isUserNameValid = Boolean(this.emailEb.string.length > 3);
            let isPasswordValid = this.passwordEb.getComponent(FieldValidator)!.doValidation(this.passwordEb.string);
            console.log(isPasswordValid.isValid, isUserNameValid);
            GameManager.Instance.PersistNodeRef.showLoader();
            ApiCalls.Instance.loginCheck(this.emailEb.string.toLowerCase(), this.passwordEb.string, this.selectMode);
        }
    }
    checkValidation() {
        let isPasswordValid = this.passwordEb.getComponent(FieldValidator)!.doValidation(this.passwordEb.string);
        // let isEmailValid = this.emailEb
        //     .getComponent(FieldValidator)!
        //     .doValidation(this.emailEb.string.toLowerCase().trim());
        if (this.emailEb.string.length < 4) {
            GameManager.Instance.PersistNodeRef.showSnackBar(ERROR_MSG.ADD_DATA, 2, 1);
            return false;
        }
        switch (false) {
            // case isEmailValid.isValid:
            //     GameManager.Instance.PersistNodeRef.showSnackBar(ERROR_MSG.INVALID_EMAIL, 2, 1);
            //     return false;
            case isPasswordValid.isValid:
                GameManager.Instance.PersistNodeRef.showSnackBar(ERROR_MSG.INVALID_PWD, 2, 1);
                return false;
        }

        return true;
    }

    signUpPanelClick() {
        this.hide();
        PopupManager.show(POPUPS.SIGNUP, {});
    }
    close() {
        this.hide();
    }
    forgetPasswordClick() {
        let isUserNameValid = this.emailEb.getComponent(FieldValidator)!.doValidation(this.emailEb.string);
        PopupManager.show(POPUPS.FORGOT_PASSWORD, { email: this.emailEb.string });

    }
    start() { }
    update(deltaTime: number) { }
}
