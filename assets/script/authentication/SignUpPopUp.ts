import { _decorator, EditBox, Node } from "cc";
import { API_END_POINTS, REQUEST_TYPE, SERVER } from "../../script/managers/NetworkConfig";
import { NetworkManager } from "../../script/managers/NetworkManager";
import { PopupManager } from "../../script/managers/PopupManager";
import PopupBase from "../../components/popup/PopupBase";
import { POPUPS } from "../../script/constants/Popup";
import { GameManager } from "../../script/managers/GameManager";
import { ERROR_MSG } from "../../script/comman/Strings";
import { FieldValidator } from "../../script/comman/FieldValidator";

const { ccclass, property } = _decorator;

@ccclass("SignUpPopUp")
export class SignUpPopUp extends PopupBase {
    @property({ type: EditBox, displayName: "Email Editbox" }) emailEb = new EditBox();
    @property({ type: EditBox, displayName: "Username Editbox" }) usernameEb = new EditBox();
    @property({ type: EditBox, displayName: "Password Editbox" }) passwordEb = new EditBox();
    @property({ type: Node }) signUpPanel: Node = null!;

    start() {
        NetworkManager.getInstance().init(SERVER);
    }
    onAvatarClick() {
        PopupManager.show(POPUPS.SELECTAVATAR, {});
    }

    protected onEnable(): void {

    }

    protected updateDisplay(options: any): void {

    }

    signUpBtnClick() {

        if (!this.checkValidation()) {
            return;
        } else {
            GameManager.Instance.PersistNodeRef.showLoader();
            this.register();
        }
    }
    checkValidation() {
        let isPasswordValid = this.passwordEb.getComponent(FieldValidator)!.doValidation(this.passwordEb.string);
        let isEmailValid = this.emailEb
            .getComponent(FieldValidator)!
            .doValidation(this.emailEb.string.toLowerCase().trim());
        switch (false) {
            case isEmailValid.isValid:
                GameManager.Instance.PersistNodeRef.showSnackBar(ERROR_MSG.INVALID_EMAIL, 2, 1);
                return false;
            case isPasswordValid.isValid:
                GameManager.Instance.PersistNodeRef.showSnackBar(ERROR_MSG.INVALID_PWD, 2, 1);
                return false;
        }
        return true;
    }

    loginPanelBtnClick() {
        this.hide();
        PopupManager.show(POPUPS.LOGIN, {});
    }
    signUpBTnCLick() {
        // if()
    }

    continueBtnClick() {
        this.hide();
    }

    register() {
        let user = {
            user: {
                username: this.usernameEb.string,
                email: this.emailEb.string.toLowerCase().trim(),
                password: this.passwordEb.string,
            },
        };
        console.log("response sent");

        let onSuccess = (data) => {
            data = JSON.parse(data);
            GameManager.Instance.PersistNodeRef.showSnackBar(data.status.message, 6, 1);
            GameManager.Instance.PersistNodeRef.hideLoader();
            console.log("signUp complete", data);
            this.loginPanelBtnClick();
        };
        let onError = (data = null) => {
            data = JSON.parse(data);
            console.log("data error message ", data.errors.message);
            GameManager.Instance.PersistNodeRef.hideLoader();
            GameManager.Instance.PersistNodeRef.showSnackBar(data.errors.message, 2, 1);
        };

        NetworkManager.getInstance().sendRequest(
            API_END_POINTS.REGISTER,
            REQUEST_TYPE.POST,
            user,
            onSuccess,
            onError,
            false
        );
    }
    update(deltaTime: number) { }
}
