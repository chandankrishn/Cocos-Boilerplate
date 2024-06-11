import { Validator } from "./Validations";
import { _decorator, Component, Enum } from "cc";
const { ccclass, property } = _decorator;

export enum VALIDATOR_TYPE {
    EMAIL = 1,
    PASSWORD = 2,
    USERNAME = 3,
    NAME = 4,
    UNAME_EMAIL = 5,
}

@ccclass("FieldValidator")
export class FieldValidator extends Component {
    @property({ type: Enum(VALIDATOR_TYPE) }) validationType: VALIDATOR_TYPE =
        VALIDATOR_TYPE.NAME;

    doValidation(text: string): {
        isValid: boolean,
        message: string,
    } {
        console.log("text", text);

        switch (this.validationType) {
            case VALIDATOR_TYPE.EMAIL:
                return Validator.emailValidation(text);
            case VALIDATOR_TYPE.NAME:
                return Validator.nameValidation(text);
            case VALIDATOR_TYPE.USERNAME:
                return Validator.usernameValidation(text);
            case VALIDATOR_TYPE.PASSWORD:
                return Validator.passwordValidation(text);
            case VALIDATOR_TYPE.UNAME_EMAIL:
                return Validator.uNameEmailValidation(text);
            default:
                return { isValid: false, message: "No valid validator" };
        }
        // is valid and error message
    }
}
