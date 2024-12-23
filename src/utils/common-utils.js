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
        let info = {
           name: `Неизвестно`,
           color: `secondary`,
           icon: 'times',
        };
        switch (status) {
            case config.orderStatuses.new:
                info.name = `Новый`;
                info.color = `secondary`;
                info.icon = `star`;
                break;
            case config.orderStatuses.success:
                info.name = `Выполнен`;
                info.color = `success`;
                info.icon = 'check';
                break;
            case config.orderStatuses.confirmed:
                info.name = `Подтвержден`;
                info.color = `info`;
                info.icon = 'eye';
                break;
            case config.orderStatuses.canceled:
                info.name = `Отменен`;
                info.color = `danger`;
                info.icon = 'times';
                break;
        }
        return info;
    }
}