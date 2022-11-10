import config from "../config/config.js";
import Routes from "./Routes.js";
import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app) {
        this.app = app;
        this.routes = new Routes();
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
        /**
         * Express route handlers
         */
        this.app.get("/", async (req, res) => {
            /**
             * GET /
             * server probe request to check readiness of the worker service
             */
            await this.routes.probe(req, res, "/");
        });

        this.app.get("/api/connect", async (req, res) => {
            /**
             * GET /api/connect
             * server request to worker to request connection to lightning node
             */
            await this.routes.connect(req, res, "/api/connect");

            // try {
            //     const response = await sendGetRequest(
            //         workerUrl,
            //         "/api/connect"
            //     );
            //     res.send({
            //         data: response,
            //     });
            // } catch (error) {
            //     console.log(error);
            // }
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * server request to worker to request lightning node info/status
             */
            try {
                const response = await sendGetRequest(workerUrl, "/api/info");
                res.send({
                    data: response,
                });
            } catch (error) {
                console.log(error);
            }
        });

        this.app.get("/api/payment/:id/invoice", async () => {
            /**
             * GET /api/payment/:id/invoice
             * server request to worker to send a payment for a lightning invoice request
             */
            try {
                const response = await sendGetRequest(
                    workerUrl,
                    "/api/payment/:id/invoice"
                );
                res.send({
                    data: response,
                });
            } catch (error) {
                console.log(error);
            }
        });

        this.app.get("/api/disconnect", async (req, res) => {
            await this.routes.disconnect(req, res, "/api/disconnect");
            /**
             * GET /api/disconnect
             * server request to worker to request to terminate connection to lightning node
             */
            // try {
            //     const response = await sendGetRequest(
            //         workerUrl,
            //         "/api/disconnect"
            //     );
            //     res.send({
            //         data: response,
            //     });
            // } catch (error) {
            //     console.log(error);
            // }
        });

        /**
         * Axios handlers
         * TODO: this is getting moved to Routes.js
         */
        // const sendGetRequest = async (url, route = "/") => {
        //     try {
        //         const res = await fetch(`${url}${route}`, {
        //             signal: AbortSignal.timeout(5000),
        //         });
        //         if (res.ok) {
        //             const data = await res.json();
        //             console.log(`data: ${data}`);
        //             return data;
        //         } else {
        //             console.log("Fetch failed to return a response");
        //             return {
        //                 status: 500,
        //                 message: "Fetch failed to return a response",
        //             };
        //         }
        //     } catch (error) {
        //         if (error.name === "TimeoutError") {
        //             console.error(
        //                 `Error: TimeoutError - ${config.defaultTimeout} ms`
        //             );
        //         } else if (error.name === "AbortError") {
        //             console.error(
        //                 "Fetch aborted by user action (browser stop button, closing tab, etc."
        //             );
        //         } else if (error.name === "TypeError") {
        //             console.error(
        //                 "AbortSignal.timeout() method is not supported"
        //             );
        //         } else {
        //             // A network error, or some other problem.
        //             console.error(
        //                 `Error: type: ${error.name}, message: ${error.message}`
        //             );
        //         }
        //     }
        // };
    }
}
