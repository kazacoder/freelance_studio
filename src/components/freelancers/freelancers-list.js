import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersList {
    constructor(openNewRoute) {
        this.recordsElement = document.getElementById('records')
        this.openNewRoute = openNewRoute;
        this.getFreelancers().then()
    }

    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showRecords(response.freelancers)
    }

    showRecords (freelancers) {
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
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('freelancers', freelancer.id)
            this.recordsElement.appendChild(trElement);

        });
        document.querySelectorAll('.delete-item').forEach(element => {
            element.addEventListener('click', () => {
                document.getElementById('delete-link').href = element.getAttribute('delete-link');
            });
        })
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
        });
    }
}