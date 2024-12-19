import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class FreelancersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.getFreelancer(id).then()
        document.getElementById('edit-link').href += id;
        document.getElementById('delete-link').href += id;
    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе фрилансера. Обратитесь в поддержку');
        }
        console.log(result.response);
        this.showFreelancer(result.response)
    }

    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('name').innerText = `${freelancer.name} ${freelancer.lastName}`;
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);
        document.getElementById('email').innerText = freelancer.email;
        document.getElementById('education').innerText = freelancer.education;
        document.getElementById('location').innerText = freelancer.location;
        document.getElementById('skills').innerText = freelancer.skills;
        document.getElementById('info').innerText = freelancer.info;
        if (freelancer.createdAt) {

            document.getElementById('created').innerText = new Date(freelancer.createdAt)
                .toLocaleString('ru-RU');
        }
    }
}

const fr = {
    avatar: "/images/freelancers/avatars/1.jpg",
    createdAt: "2024-12-16T13:21:17.188Z",
    education: "Бакалавр информатики",
    email: "ivan.ivanov@example.com",
    id: "6760294df68dbe470a2e5a05",
    info: "Разработчик JavaScript с опытом работы 2 года, специализирующийся на React и фронтенд разработке.",
    lastName: "Иванов",
    level: "junior",
    location: "Москва, Россия",
    name: "Иван",
    skills: "JavaScript, React",
    updatedAt: "2024-12-16T13:21:17.188Z",
}