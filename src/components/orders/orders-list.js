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

    showRecords (orders) {
        orders.forEach((order) => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = order.number;
            trElement.insertCell().innerText = order.owner.name + ' ' + order.owner.lastName;
            trElement.insertCell().innerHTML =
                `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name + ' ' + order.freelancer.lastName}</a>`
            trElement.insertCell().innerText = new Date(order.scheduledDate).toLocaleString('ru-RU');
            trElement.insertCell().innerText = new Date(order.deadlineDate).toLocaleString('ru-RU');

            const statusInfo = CommonUtils.getStatusInfoHtml(order.status)
            trElement.insertCell().innerHTML = `<span class="badge badge-${statusInfo.color}">${statusInfo.name}</span>`;


            if (order.completeDate) {
                trElement.insertCell().innerText = new Date(order.completeDate).toLocaleString('ru-RU');
            }  else trElement.insertCell().innerText = ''
            trElement.insertCell().innerHTML =
                '<div class="order-tools">' +
                '<a href="/orders/view?id=' + order.id + '" class="fas fa-eye" title="Просмотр"></a>' +
                '<a href="/orders/edit?id=' + order.id + '" class="fas fa-edit" title="Редактирование"></a>' +
                '<a href="#" class="fas fa-trash delete-item" delete-link="/orders/delete?id=' + order.id + '" title="Удаление" data-toggle="modal" data-target="#modal-danger"></a>' +
                // '<a href="/orders/delete?id=' + order.id + '" class="fas fa-trash" title="Удаление"></a>' +
                '</div>';

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