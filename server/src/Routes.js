import config from "../config/config.js";
export default class Routes {
    constructor() {
        this.config = config;
        this.worker = config.connections.dockerUserDefinedNetwork?.worker;
        this.url = `${this.worker?.url}:${this.worker?.port}`;
    }

    async probeWorker(req, res, route) {
        const url = `${this.url}${route}`;
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
     * BonuslyWorker
     */
    async getUsersBonusly(req, res, route) {
        const url = `${this.url}${route}`;
        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getUserBonusly(req, res, route) {
        const url = `${this.url}${route}`;
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
     * NodeWorker
     */
    async connectNode(req, res, route) {
        const url = `${this.url}${route}`;
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

    async getInfoNode(req, res, route) {
        const url = `${this.url}${route}`;
        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async paymentRequestNode(req, res, route) {
        const url = `${this.url}${route}`;
        try {
            const response = await this.sendPostRequest(url, req.body);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async disconnectNode(req, res, route) {
        const url = `${this.url}${route}`;
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
        const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Error: Fetch GET attempt failed");
        }
    }

    async sendPostRequest(url, payload) {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Error: Fetch POST attempt failed");
        }
    }
}
