import { ERROR_MSG } from "../../constants/String";
/**
 * Validators class for basic fucntionality test
 */
export namespace Validator {
    /**
     * Email validation of the string enetered by the student
     * @param email Email entered by user
     * @returns
     */
    export function emailValidation(email: string) {
        let isValid = true;
        let regexEmail: RegExp =
            /^([A-Za-z0-9\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

        if (
            email == null ||
            email.length == 0 ||
            email.length > 256 ||
            !regexEmail.test(email)
        ) {
            isValid = false;
        }
        return {
            isValid: isValid,
            message: isValid ? "" : ERROR_MSG.InvalidEmail,
        };
    }

    /**
     * Validations on username
     * @param name sting passed by user.
     * @returns
     */
    export function nameValidation(name: string) {
        let isValid = validateLength(name, 3, 32);
        if (!isValid) {
            let errorMsg = updateErrorMsg("Name", 3, 32);
            return {
                isValid: isValid,
                message: isValid ? "" : errorMsg,
            };
        }
        let regexCharDig: RegExp = /^[^\s][a-zA-Z\s]*$/;
        if (!regexCharDig.test(name)) {
            isValid = false;
        }
        return {
            isValid: isValid,
            message: isValid ? "" : ERROR_MSG.InvalidName,
        };
    }

    /**
     * Password validator for
     * @param password password user has to enter
     */
    export function passwordValidation(password: string) {
        let isValid = validateLength(password, 8, 32);
        if (!isValid) {
            let errorMsg = updateErrorMsg("Password", 8, 32);
            return {
                isValid: isValid,
                message: isValid ? "" : ERROR_MSG.Invalid_PSWD,
            };
        }
        let regexPass: RegExp =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\[\]\:\;\"\'\|\\\<\,\>\.\?\/]).*$/;
        if (!regexPass.test(password)) {
            isValid = false;
        }
        return {
            isValid: isValid,
            message: isValid ? "" : ERROR_MSG.Invalid_PSWD,
        };
    }

    /**
     * Validate username string
     * @param username username validations
     * @returns
     */

    export function usernameValidation(username: string) {
        let isValid = validateLength(username, 3, 32);
        if (!isValid) {
            let errorMsg = updateErrorMsg("Username", 3, 32);
            return {
                isValid: isValid,
                message: isValid ? "" : errorMsg,
            };
        }
        let regexCharDig: RegExp = /^[a-zA-Z ]*$/;
        if (!regexCharDig.test(username)) {
            isValid = false;
        }
        return {
            isValid: isValid,
            message: isValid ? "" : ERROR_MSG.InvalidUsername,
        };
    }

    export function uNameEmailValidation(username: string) {
        let isValid = validateLength(username, 3, 255);
        if (!isValid) {
            let errorMsg = updateErrorMsg("Username/Email", 3, 255);
            return {
                isValid: isValid,
                message: isValid ? "" : errorMsg,
            };
        }

        let isValidName = true;
        let regexCharDig: RegExp = /^[A-Za-z]+[A-Za-z0-9]*$/i;
        if (!regexCharDig.test(username)) {
            isValidName = false;
        }

        let isValidEmail = true;
        let regexEmail: RegExp =
            /^([A-Za-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

        if (
            username == null ||
            username.length == 0 ||
            username.length > 256 ||
            !regexEmail.test(username)
        ) {
            isValidEmail = false;
        }

        isValid = isValidEmail || isValidName;

        return {
            isValid: isValid,
            message: isValid ? "" : ERROR_MSG.InvalidEmail,
        };
    }

    function validateLength(
        text: string,
        minLength: number,
        maxLength: number
    ) {
        if (text == null || text.toString().length == 0) return false;
        let textLength = text.length;
        if (textLength < minLength || textLength > maxLength) {
            return false;
        }
        return true;
    }
    /**
     * Function to uodae error message
     * @param validationName
     * @param minLength
     * @param maxLength
     * @returns
     */
    function updateErrorMsg(
        validationName: string,
        minLength: number,
        maxLength: number
    ) {
        let errorMsg = ERROR_MSG.InvalidName;
        errorMsg = errorMsg.replace("&name", validationName);
        errorMsg = errorMsg.replace("&min", minLength.toString());
        errorMsg = errorMsg.replace("&max", maxLength.toString());
        return errorMsg;
    }
}
