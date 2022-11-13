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
            await this.routes.probeWorker(req, res, "/");
        });

        /**
         * BonuslyWorker
         */
        this.app.get("/api/users", async (req, res) => {
            /**
             * GET /api/users
             * get the Bonusly users
             */
            await this.routes.getUsersBonusly(req, res, "/api/users");
        });

        this.app.get("/api/users/:id", async (req, res) => {
            /**
             * GET /api/users
             * get the Bonusly users
             */
            console.log(`id: ${req.params?.id}`);
            await this.routes.getUserBonusly(req, res, "/api/users/:id");
        });

        /**
         * NodeWorker
         */
        this.app.get("/api/connect", async (req, res) => {
            /**
             * GET /api/connect
             * server request to worker to request connection to lightning node
             */
            await this.routes.connectNode(req, res, "/api/connect");
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * server request to worker to request lightning node info/status
             */
            await this.routes.getInfoNode(req, res, "/api/info");
        });

        this.app.post("/api/paymentrequest/:id/invoice", async (req, res) => {
            /**
             * POST /api/paymentrequest/:id/invoice
             * server request to worker to send a payment for a lightning invoice request
             */
            console.log(`id: ${id}`);
            await this.routes.paymentRequestNode(
                req,
                res,
                "/api/paymentrequest"
            );
        });

        this.app.get("/api/disconnect", async (req, res) => {
            /**
             * GET /api/disconnect
             * server request to worker to request to terminate connection to lightning node
             */
            await this.routes.disconnectNode(req, res, "/api/disconnect");
        });
    }
}
