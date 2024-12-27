import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.getOrder(id).then()
        document.getElementById('edit-link').href += id;
        document.getElementById('delete-link').href = "/orders/delete?id=" + id;
    }

    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе заказа. Обратитесь в поддержку');
        }
        this.showOrder(result.response)
    }

    showOrder(order) {
        const statusInfo = CommonUtils.getStatusInfoHtml(order.status)
        document.getElementById('order-status').classList.add(`bg-${statusInfo.color}`);
        document.getElementById('order-status-icon').classList.add(`fa-${statusInfo.icon}`);
        document.getElementById('order-status-value').innerText = statusInfo.name.toUpperCase();

        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        }
        document.getElementById('freelancer-name').innerHTML =
            `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name} ${order.freelancer.lastName}</a>`;


        if (order.scheduledDate) {
            document.getElementById('scheduled').innerHTML = new Date(order.scheduledDate).toLocaleDateString();
        }
        if (order.completeDate) {
            document.getElementById('complete').innerHTML = new Date(order.completeDate).toLocaleDateString();
        }
        if (order.deadlineDate) {
            document.getElementById('deadline').innerHTML = new Date(order.deadlineDate).toLocaleDateString();
        }

        document.getElementById('order-number').innerText = `${order.number}`;
        document.getElementById('description').innerText = `${order.description}`;
        document.getElementById('owner').innerText = `${order.owner.name} ${order.owner.lastName}`;
        document.getElementById('amount').innerText = order.amount;
        if (order.createdAt) {
            document.getElementById('created').innerText = new Date(order.createdAt)
                .toLocaleString('ru-RU');
        }
    }
}
