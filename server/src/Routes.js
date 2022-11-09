import config from "../config/config.js";
export default class Routes {
    constructor() {
        this.config = config;
        this.worker = config.connections.dockerUserDefinedNetwork?.worker;
    }

    async probe(req, res, route) {
        const url = `${this.worker?.url}:${this.worker?.port}${route}`;
        try {
            const response = await this.sendGetRequest(url, route);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async connect(req, res, route) {
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

    /**
     * Axios handlers
     */
    async sendGetRequest(url) {
        try {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(5000),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(`data: ${data}`);
                return data;
            } else {
                console.log("Fetch failed to return a response");
                return {
                    status: 500,
                    message: "Fetch failed to return a response",
                };
            }
        } catch (error) {
            if (error.name === "TimeoutError") {
                console.error(
                    `Error: TimeoutError - ${this.config.defaultTimeout} ms`
                );
            } else if (error.name === "AbortError") {
                console.error(
                    "Fetch aborted by user action (browser stop button, closing tab, etc."
                );
            } else if (error.name === "TypeError") {
                console.error("AbortSignal.timeout() method is not supported");
            } else {
                // A network error, or some other problem.
                console.error(
                    `Error: type: ${error.name}, message: ${error.message}`
                );
            }
        }
    }
}
