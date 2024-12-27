export class UrlUtils {
    static getUrlParam(params) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(params);
    }
}