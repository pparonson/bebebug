import config from "../config/config.js";
export default class BonuslyWorker {
    constructor() {
        this.config = config;
    }

    async getUsers(req, res, route) {
        /**
         * https://bonus.ly/api/v1/users
         */
        let url = `${this.config.connections.bonuslyApi?.host}${route}`;

        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getUser(req, res, route) {
        /**
         * https://bonus.ly/api/v1/users/id
         */
        let url = `${this.config.connections.bonuslyApi?.host}${route}`;

        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * fetch handlers
     */
    async sendGetRequest(url) {
        const options = {
            method: "get",
            headers: new Headers({
                Authorization: `Bearer ${this.config.connections.bonuslyApi?.accessToken}`,
            }),
        };
        const res = await fetch(url, options);

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Error: Fetch attempt failed");
        }
    }
}
