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
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * server request to worker to request lightning node info/status
             */

            await this.routes.getInfo(req, res, "/api/info");
        });

        this.app.get("/api/paymentrequest/:id/invoice", async () => {
            /**
             * GET /api/payment/:id/invoice
             * server request to worker to send a payment for a lightning invoice request
             */

            await this.routes.paymentRequest(req, res, "/api/paymentrequest");
        });

        this.app.get("/api/disconnect", async (req, res) => {
            await this.routes.disconnect(req, res, "/api/disconnect");
            /**
             * GET /api/disconnect
             * server request to worker to request to terminate connection to lightning node
             */
            await this.routes.disconnect(req, res, "/api/disconnect");
        });
    }
}
