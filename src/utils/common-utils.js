import config from "../config/config";

export class CommonUtils {
    static getLevelHtml(level) {
        let levelHTML = null;
        switch (level) {
            case config.freelancerLevels.junior:
                levelHTML = `<span class="badge badge-info">Junior</span>`;
                break;
            case config.freelancerLevels.middle:
                levelHTML = `<span class="badge badge-warning">Middle</span>`;
                break;
            case config.freelancerLevels.senior:
                levelHTML = `<span class="badge badge-success">Senior</span>`;
                break;
            default:
                levelHTML = `<span class="badge badge-secondary">Unknown</span>`;
        }
        return levelHTML;
    }

    static getStatusInfoHtml(status) {
        let levelHTML = null;
        switch (status) {
            case config.orderStatuses.new:
                levelHTML = `<span class="badge badge-secondary">Новый</span>`;
                break;
            case config.orderStatuses.success:
                levelHTML = `<span class="badge badge-success">Выполнен</span>`;
                break;
            case config.orderStatuses.confirmed:
                levelHTML = `<span class="badge badge-info">Подтвержден</span>`;
                break;
            case config.orderStatuses.canceled:
                levelHTML = `<span class="badge badge-danger">Отменен</span>`;
                break;
            default:
                levelHTML = `<span class="badge badge-secondary">Неизвестно</span>`;
        }
        return levelHTML;
    }
}