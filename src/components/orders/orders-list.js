import {CommonUtils} from "../../utils/common-utils";
import {OrdersService} from "../../services/orders-service";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.recordsElement = document.getElementById('records')
        this.getOrders().then()
    }

    async getOrders() {
        const response = await OrdersService.getOrders();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showRecords(response.orders)
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