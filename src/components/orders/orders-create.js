import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputs = {}
        $('#calendar-scheduled').datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
        })

        // this.commonErrorElement = document.getElementById('common-error');
        // document.querySelectorAll('input, textarea, select').forEach(el => {
        //     this.inputs[el.id + 'Element'] = el;
        // })
        // this.textInputsArray = Object.values(this.inputs).filter(el => el.type === 'text' || el.type === 'textarea')
        // document.getElementById('saveButton').addEventListener('click', this.saveFreelancers.bind(this));

    }


    async saveFreelancers(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (this.validateForm()) {
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

    validateForm() {
        let isValid = true

        if (this.inputs.emailInputElement.value && this.inputs.emailInputElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.inputs.emailInputElement.classList.remove('is-invalid');
        } else {
            this.inputs.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        this.textInputsArray.forEach((el) => {
            if (el.value) {
                el.classList.remove('is-invalid');
            } else {
                el.classList.add('is-invalid');
                isValid = false;
            }
        })

        return isValid;
    }
}