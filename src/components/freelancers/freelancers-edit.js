import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        bsCustomFileInput.init();
        this.inputs = {}
        this.commonErrorElement = document.getElementById('common-error');
        document.querySelectorAll('input, textarea, select').forEach(el => {
            this.inputs[el.id + 'Element'] = el;
        })
        console.log(this.inputs);
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.getFreelancer(id).then()

    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе фрилансера. Обратитесь в поддержку');
        }
        console.log(result.response);
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
        // if (freelancer.createdAt) {
        //
        //     document.getElementById('created').innerText = new Date(freelancer.createdAt)
        //         .toLocaleString('ru-RU');
        // }
    }
}