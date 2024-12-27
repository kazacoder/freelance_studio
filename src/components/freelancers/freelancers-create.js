import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        bsCustomFileInput.init();
        this.findElements()
        this.validations = [{
            element: this.inputs.emailInputElement,
            options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
        }]
        this.textInputsArray.forEach(el => {this.validations.push({element: el})})
        document.getElementById('saveButton').addEventListener('click', this.saveFreelancers.bind(this));
    }

    findElements () {
        this.inputs = {}
        this.commonErrorElement = document.getElementById('common-error');
        document.querySelectorAll('input, textarea, select').forEach(el => {
            this.inputs[el.id + 'Element'] = el;
        })
        this.textInputsArray = Object.values(this.inputs).filter(el => el.type === 'text' || el.type === 'textarea')
    }

    async saveFreelancers(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                name: this.inputs.nameInputElement.value,
                lastName: this.inputs.lastNameInputElement.value,
                email: this.inputs.emailInputElement.value,
                level: this.inputs.levelSelectElement.value,
                education: this.inputs.educationInputElement.value,
                location: this.inputs.locationInputElement.value,
                skills: this.inputs.skillsInputElement.value,
                info: this.inputs.infoInputElement.value,
            }

            if (this.inputs.avatarInputElement.files && this.inputs.avatarInputElement.files.length > 0) {
                createData.avatarBase64 = await FileUtils.convertFileToBase64(this.inputs.avatarInputElement.files[0])
            }

            const result = await HttpUtils.request('/freelancers', 'POST', true, createData);

            if (result.redirect) {
                this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                this.commonErrorElement.style.display = 'block';
                if (result.response.message) {
                    this.commonErrorElement.innerText = result.response.message;
                }
                return;
            }
            return this.openNewRoute("/freelancers/view?id=" + result.response.id);
        } else {
            console.log('INVALID')
        }
    }
}