import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        this.recordsElement = document.getElementById('records')
        this.openNewRoute = openNewRoute;
        console.log('FreelancersList');
        this.getFreelancers().then()
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response ||
            (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }
        this.showRecords(result.response.freelancers)
    }

    showRecords (freelancers) {
        console.log(freelancers)
        freelancers.forEach((freelancer, index) => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = index + 1;
            trElement.insertCell().innerHTML = freelancer.avatar ?
                `<img class="freelancer-avatar" src="${config.host}${freelancer.avatar}" alt="User photo">`: '';
            trElement.insertCell().innerText = freelancer.name + ' ' + freelancer.lastName;
            trElement.insertCell().innerText = freelancer.email;
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancer.level);
            trElement.insertCell().innerText = freelancer.education;
            trElement.insertCell().innerText = freelancer.location;
            trElement.insertCell().innerText = freelancer.skills;
            trElement.insertCell().innerHTML =
                '<div class="freelancer-tools">' +
                '<a href="/freelancers/view?id=' + freelancer.id + '" class="fas fa-eye" title="Просмотр"></a>' +
                '<a href="/freelancers/edit?id=' + freelancer.id + '" class="fas fa-edit" title="Редактирование"></a>' +
                '<a href="/freelancers/delete?id=' + freelancer.id + '" class="fas fa-trash" title="Удаление"></a>' +
                '</div>';

            this.recordsElement.appendChild(trElement);

        });
        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next":       "Вперед",
                    "previous":   "Назад"
                },
            },
            "paging": true,
            // "bDestroy": true,

        });

    }
}