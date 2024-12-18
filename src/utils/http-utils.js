import config from "../config/config";

export class HttpUtils {
    static async request(url, method = 'GET', body = null) {
        const params = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
         if (body) {
             params.body = JSON.stringify(body);
         }
        const response = await fetch(config.api + url, params);
        return  await response.json();
    }
}