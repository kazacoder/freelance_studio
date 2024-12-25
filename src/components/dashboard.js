import {HttpUtils} from "../utils/http-utils";
import config from "../config/config";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getOrders().then();
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
        this.loadOrdersInfo(result.response.orders)
        this.loadCalendarInfo(result.response.orders)
    }

    loadOrdersInfo(orders) {
        document.getElementById('count-orders').innerText = orders.length;
        document.getElementById('done-orders').innerText =
            orders.filter(order => order.status === config.orderStatuses.success).length;
        document.getElementById('in-progress-orders').innerText =
            orders.filter(order => [config.orderStatuses.confirmed, config.orderStatuses.new].includes(order.status)).length;
        document.getElementById('canceled-orders').innerText =
            orders.filter(order => order.status === config.orderStatuses.canceled).length;
    }

    loadCalendarInfo(orders) {
        const preparedEvents = []

        orders.forEach(order => {
            let color = null
            if (order.status === config.orderStatuses.success) {
                color = 'gray'
            }

            if (order.scheduledDate) {
                const scheduledDate = new Date(order.scheduledDate);
                preparedEvents.push({
                    title: `${order.freelancer.name} ${order.freelancer.lastName} выполняет заказ ${order.number}`,
                    start: scheduledDate,
                    backgroundColor: color ? color : '#00c0ef', //Info (aqua)
                    borderColor: color ? color : '#00c0ef', //Info (aqua)
                    allDay: true,
                })
            }

            if (order.deadlineDate) {
                const deadlineDate = new Date(order.deadlineDate);
                preparedEvents.push({
                    title: `Дедлайн заказа ${order.number}`,
                    start: deadlineDate,
                    backgroundColor: color ? color : '#f39c12', //yellow
                    borderColor: color ? color : '#f39c12', //yellow
                    allDay: true,
                })
            }

            if (order.completeDate) {
                const completeDate = new Date(order.completeDate);
                preparedEvents.push({
                    title: `Заказ ${order.number} выполнен фрилансером ${order.freelancer.name}`,
                    start: completeDate,
                    backgroundColor: '#00a65a', //Success (green)
                    borderColor: '#00a65a', //Success (green)
                    allDay: true,
                })
            }
        })

        const calendarElement = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                },
                themeSystem: 'bootstrap',
                locale: 'ru',
                events: preparedEvents,
            }
        )
        calendar.render();
    }
}

const colors =
    {
        backgroundColor: '',
        borderColor: '',
        red: '#f56954', //red
        yellow: '#f39c12', //yellow
        Blue: '#0073b7', //Blue
        Info: '#00c0ef', //Info (aqua)
        Success: '#00a65a', //Success (green)
        Primary: '#3c8dbc', //Primary (light-blue)
    }