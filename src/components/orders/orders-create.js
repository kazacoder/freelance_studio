import {HttpUtils} from "../../utils/http-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputs = {}
        const calendarScheduled = $('#calendar-scheduled');
        const calendarDeadline = $('#calendar-deadline');
        const calendarComplete = $('#calendar-complete');
        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        calendarScheduled.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarScheduled.on('change.datetimepicker', (e) => {
            this.scheduledDate = e.date
        });

        calendarComplete.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            buttons: {
                showClear: true,
            }
        });
        calendarComplete.on('change.datetimepicker', (e) => {
            this.completeDate = e.date
        });

        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on('change.datetimepicker', (e) => {
            this.deadlineDate = e.date
        })

        this.getFreelancers().then()

        this.commonErrorElement = document.getElementById('common-error');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

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

        const freelancers = result.response.freelancers;

        freelancers.forEach(freelancer => {
            const option = document.createElement("option");
            option.value = freelancer.id;
            option.innerText = `${freelancer.name} ${freelancer.lastName}`;
            this.freelancerSelectElement.appendChild(option);
        });

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }


    async saveOrder(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (this.validateForm()) {

            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
            };

            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }

            const result = await HttpUtils.request('/orders', 'POST', true, createData);

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
            return this.openNewRoute("/orders/view?id=" + result.response.id);
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

        const scheduledCardElement = document.getElementById('scheduled-card');
        if (this.scheduledDate) {
            scheduledCardElement.classList.remove('is-invalid');
        } else {
            scheduledCardElement.classList.add('is-invalid');
            isValid = false;
        }

        const deadlineCardElement = document.getElementById('deadline-card');
        if (this.deadlineDate) {
            deadlineCardElement.classList.remove('is-invalid');
        } else {
            deadlineCardElement.classList.add('is-invalid');
            isValid = false;
        }

        console.log(this.scheduledDate)
        console.log(this.deadlineDate)
        return isValid;
    }
}