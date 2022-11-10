import config from "../config/config.js";
export default class Routes {
    constructor() {
        this.config = config;
        this.worker = config.connections.dockerUserDefinedNetwork?.worker;
    }

    async probe(req, res, route) {
        const url = `${this.worker?.url}:${this.worker?.port}${route}`;
        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async connect(req, res, route) {
        const url = `${this.worker?.url}:${this.worker?.port}${route}`;
        console.log(`connect url: ${url}`);
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
     * Axios handlers
     */
    async sendGetRequest(url) {
        const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Error: Fetch attempt failed");
        }
    }
}
