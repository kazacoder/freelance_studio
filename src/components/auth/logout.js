import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !this.refreshToken) {
            return this.openNewRoute('/login')
        }
        this.logout().then();

    }

    async logout() {
        const result = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: this.refreshToken,
        });

        console.log(result);

        AuthUtils.removeAuthInfo()

        this.openNewRoute('/login');
    }
}