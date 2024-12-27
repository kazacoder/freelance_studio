import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (localStorage.getItem('accessToken')) {
            return this.openNewRoute('/')
        }
        this.findElements()

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    createValidationsObject() {
        this.validations = [
            {element: this.nameElement},
            {element: this.lastNameElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.argeeElement, options: {checked: true}},
        ]
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.argeeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        this.createValidationsObject()
        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            })

            if (signupResult && signupResult.id) {
                AuthUtils.setAuthInfo(signupResult.accessToken, signupResult.refreshToken,
                    {id: signupResult.id, name: signupResult.name});
                return this.openNewRoute('/');
            }
            this.commonErrorElement.style.display = 'block';
            if (signupResult && signupResult.errorMessage) {
                this.commonErrorElement.innerText = signupResult.errorMessage;
            }
        } else {
        }
    }
}