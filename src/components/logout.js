export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.refreshToken = localStorage.getItem('refreshToken')
        if (!localStorage.getItem('accessToken') || !this.refreshToken) {
            return this.openNewRoute('/login')
        }
        this.logout().then();

    }

    async logout() {
        const response = await fetch('http://185.155.17.105:3000/api/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: this.refreshToken,
            }),
        });
        const result = await response.json();
        console.log(result);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo')
        this.openNewRoute('/login');
    }
}