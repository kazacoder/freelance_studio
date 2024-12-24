import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        this.commonErrorElement = document.getElementById('common-error');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');

        this.orderOriginalData = {}

        this.calendarScheduled = $('#calendar-scheduled');
        this.calendarDeadline = $('#calendar-deadline');
        this.calendarComplete = $('#calendar-complete');
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

    async init () {
        await this.getOrder(this.id);
        await this.getFreelancers(this.orderOriginalData.freelancer.id).then();
    }

    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе заказа. Обратитесь в поддержку');
        }
        this.orderOriginalData = result.response
        this.showOrder(result.response)
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

        const datetimepickerObject = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            buttons: {
                showClear: true,
            }
        }

        if (order.completeDate) {
            datetimepickerObject.date = order.completeDate
        }
        this.calendarComplete.datetimepicker(datetimepickerObject);

        datetimepickerObject.date = order.scheduledDate;
        datetimepickerObject.buttons = {};

        this.calendarScheduled.datetimepicker(datetimepickerObject);

        datetimepickerObject.date = order.deadlineDate;
        this.calendarDeadline.datetimepicker(datetimepickerObject);
    }

    async getFreelancers(freelancerId) {
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response ||
            (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        const freelancers = result.response.freelancers;

        freelancers.forEach(freelancer => {
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
        if (this.validateForm()) {

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
                const result = await HttpUtils.request('/orders/' + this.orderOriginalData.id, 'put', true, updateData);

                if (result.redirect) {
                    this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    this.commonErrorElement.style.display = 'block';
                    if (result.response.message) {
                        this.commonErrorElement.innerText = result.response.message;
                    }
                    return;
                }
            }
            return this.openNewRoute("/orders/view?id=" + this.orderOriginalData.id);
        } else {
            console.log('INVALID')
        }
    }

    validateForm() {
        let isValid = true

        if (this.amountInputElement.value.match(/^\d+$/)) {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid')
            isValid = false;
        }

        if (this.descriptionInputElement.value) {
            this.descriptionInputElement.classList.remove('is-invalid');
        } else {
            this.descriptionInputElement.classList.add('is-invalid')
            isValid = false;
        }
        return isValid;
    }
}