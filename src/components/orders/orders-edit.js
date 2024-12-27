import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));
        this.findElements()


        this.validations =[
            {element: this.descriptionInputElement},
            {element: this.amountInputElement, options: {pattern: /^\d+$/}},
        ]
        this.orderOriginalData = {}


        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        this.calendarScheduled.on('change.datetimepicker', (e) => {
            this.scheduledDate = e.date
        });
        this.calendarComplete.on('change.datetimepicker', (e) => {
            this.completeDate = e.date
        });
        this.calendarDeadline.on('change.datetimepicker', (e) => {
            this.deadlineDate = e.date
        })

        this.init().then();
    }

    findElements() {
        this.commonErrorElement = document.getElementById('common-error');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.calendarScheduled = $('#calendar-scheduled');
        this.calendarDeadline = $('#calendar-deadline');
        this.calendarComplete = $('#calendar-complete');
    }

    async init () {
        await this.getOrder(this.id);
        await this.getFreelancers(this.orderOriginalData.freelancer.id).then();
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.orderOriginalData = response.order
        this.showOrder(response.order)
    }

    showOrder(order) {
        const breadcrumbsOrderElement = document.getElementById('breadcrumbs-order');
        breadcrumbsOrderElement.innerText = order.number;
        breadcrumbsOrderElement.href += order.id;

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;

        for (let option of this.statusSelectElement) {
            option.selected = option.value === order.status;
        }

        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        }

        this.calendarComplete.datetimepicker(Object.assign({}, calendarOptions,
            {
                date: order.completeDate,
                buttons: {showClear: true}
            }));
        this.calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        this.calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
    }

    async getFreelancers(freelancerId) {
        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        response.freelancers.forEach(freelancer => {
            const option = document.createElement("option");
            option.value = freelancer.id;
            option.innerText = `${freelancer.name} ${freelancer.lastName}`;
            this.freelancerSelectElement.appendChild(option);
        });

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        }).val(freelancerId).trigger('change');
    }

    async updateOrder(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const newData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
            };

            const updateData = {}

            if (this.completeDate) {
                newData.completeDate = this.completeDate.toISOString();
            } else {
                if (this.orderOriginalData.completeDate) {
                    updateData.completeDate = null
                }
            }
            for (let [key, value] of Object.entries(newData)) {
                if (key === 'freelancer') {
                   if (value !== this.orderOriginalData[key].id) {
                       updateData[key] = value;
                   }
                } else {
                   if (value !== this.orderOriginalData[key]) {
                       updateData[key] = value;
                   }
                }
            }

            if (Object.keys(updateData).length > 0) {
                const response = await OrdersService.updateOrder(this.id, updateData);
                if (response.error) {
                    if (response.errorMessage) {
                        this.commonErrorElement.style.display = 'block';
                        this.commonErrorElement.innerText = response.errorMessage;
                    } else {alert(response.error);}
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

            }
            return this.openNewRoute("/orders/view?id=" + this.orderOriginalData.id);
        } else {
            console.log('INVALID')
        }
    }
}