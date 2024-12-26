import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        bsCustomFileInput.init();
        this.freelancerOriginalData ={};
        this.inputs = {}
        this.commonErrorElement = document.getElementById('common-error');
        document.querySelectorAll('input, textarea, select').forEach(el => {
            this.inputs[el.id + 'Element'] = el;
        })
        this.textInputsArray = Object.values(this.inputs).filter(el => el.type === 'text' || el.type === 'textarea')
        this.validations = [{
            element: this.inputs.emailInputElement,
            options: {
                pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            }
        }]
        this.textInputsArray.forEach(el => {
            this.validations.push({
                element: el,
            })
        })
        const urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }
        this.getFreelancer(this.id).then()
        document.getElementById('updateButton').addEventListener('click', this.updateFreelancers.bind(this));

    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе фрилансера. Обратитесь в поддержку');
        }
        this.freelancerOriginalData = result.response
        this.showFreelancer(result.response)
    }

    showFreelancer(freelancer) {
        const breadcrumbsFreelancerElement = document.getElementById('breadcrumbs-freelancer');
        breadcrumbsFreelancerElement.innerText = `${freelancer.name} ${freelancer.lastName}`
        breadcrumbsFreelancerElement.href += freelancer.id

        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('name').innerText = `${freelancer.name} ${freelancer.lastName}`;
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);


        this.inputs.emailInputElement.value = freelancer.email;
        this.inputs.nameInputElement.value = freelancer.name;
        this.inputs.lastNameInputElement.value = freelancer.lastName;
        this.inputs.educationInputElement.value = freelancer.education;
        this.inputs.locationInputElement.value = freelancer.location;
        this.inputs.skillsInputElement.value = freelancer.skills;
        this.inputs.infoInputElement.value = freelancer.info;

        for (let option of this.inputs.levelSelectElement) {
            option.selected = option.value === freelancer.level;
        }
    }




    async updateFreelancers(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {

            const changedData = {}
            Object.keys(this.freelancerOriginalData).forEach(key => {
                if (this.inputs[key + 'InputElement'] && key !== 'avatar' &&
                    this.freelancerOriginalData[key] !== this.inputs[key + 'InputElement'].value) {
                    changedData[key] = this.inputs[key + 'InputElement'].value;
                }
            })
            if (this.inputs.avatarInputElement.files && this.inputs.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.inputs.avatarInputElement.files[0])
            }
            if (this.inputs.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.inputs.levelSelectElement.value
            }

            if (!!Object.keys(changedData).length) {
                const result = await HttpUtils.request('/freelancers/' + this.id, 'PUT', true, changedData);

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
            }
            return this.openNewRoute("/freelancers/view?id=" + this.id);
        } else {
            console.log('INVALID')
        }

    }
}