import {ValidationUtils} from "../../utils/validation-utils";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const calendarScheduled = $('#calendar-scheduled');
        const calendarDeadline = $('#calendar-deadline');
        const calendarComplete = $('#calendar-complete');
        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {time: 'far fa-clock'},
            useCurrent: false,
        }
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on('change.datetimepicker', (e) => {
            this.scheduledDate = e.date
        });

        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on('change.datetimepicker', (e) => {
            this.deadlineDate = e.date
        })

        calendarOptions.buttons = {showClear: true}
        calendarComplete.datetimepicker(calendarOptions);
        calendarComplete.on('change.datetimepicker', (e) => {
            this.completeDate = e.date
        });
        this.getFreelancers().then()
        this.findElements()

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

    }

    findElements() {
        this.commonErrorElement = document.getElementById('common-error');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    }

    async getFreelancers() {
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
        });
    }

    createValidationsObject () {
        this.validations =[
            {element: this.descriptionInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}},
            {element: this.amountInputElement, options: {pattern: /^\d+$/}},
        ]
    }

    async saveOrder(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        this.createValidationsObject()
        if (ValidationUtils.validateForm(this.validations)) {
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

            const response = await OrdersService.createOrder(createData);
            if (response.error) {
                if (response.errorMessage) {
                    this.commonErrorElement.style.display = 'block';
                    this.commonErrorElement.innerText = response.errorMessage;
                } else {alert(response.error);}
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute("/orders/view?id=" + response.id);
        } else {
            console.log('INVALID')
        }

    }
}