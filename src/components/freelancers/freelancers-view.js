import {HttpUtils} from "../../utils/http-utils";

export class FreelancersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
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

    showFreelancer (freelancer) {

    }
}