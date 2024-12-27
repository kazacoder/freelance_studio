import {HttpUtils} from "../../utils/http-utils";
import {CommonUtils} from "../../utils/common-utils";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.recordsElement = document.getElementById('records')
        this.getOrders().then()
    }

    async getOrders() {
        const result = await HttpUtils.request('/orders');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response ||
            (result.response && (result.response.error || !result.response.orders))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }
        this.showRecords(result.response.orders)
    }

    showRecords(orders) {
        orders.forEach((order) => {
            const statusInfo = CommonUtils.getStatusInfoHtml(order.status)

            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = order.number;
            trElement.insertCell().innerText = order.owner.name + ' ' + order.owner.lastName;
            trElement.insertCell().innerHTML =
                `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name + ' ' + order.freelancer.lastName}</a>`
            trElement.insertCell().innerText = new Date(order.scheduledDate).toLocaleString('ru-RU');
            trElement.insertCell().innerText = new Date(order.deadlineDate).toLocaleString('ru-RU');
            trElement.insertCell().innerHTML = `<span class="badge badge-${statusInfo.color}">${statusInfo.name}</span>`;
            trElement.insertCell().innerText = order.completeDate ? new Date(order.completeDate).toLocaleString('ru-RU') : '';
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('orders', order.id)

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
                    "next": "Вперед",
                    "previous": "Назад"
                },
            },
            "paging": true,
        });
    }
}