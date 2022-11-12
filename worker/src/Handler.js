import config from "../config/config.js";
import NodeWorker from "./NodeWorker.js";
import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app) {
        this.app = app;
        this.config = config;
        this.nodeWorker = new NodeWorker();
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
        /**
         * Express route handlers
         */
        this.app.get("/", async (req, res) => {
            res.send({
                message: "Worker service is ready",
            });
        });

        this.app.get("/api/connect", async (req, res) => {
            /**
             * GET /api/connect
             */
            await this.nodeWorker.connect(req, res, "/api/connect");
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * get the Lightning Node info
             */
            await this.nodeWorker.getInfo(req, res);
        });

        this.app.post("/api/payment/:id", async (req, res) => {
            /**
             * POST /api/payment
             * send a payment for a lightning invoice request
             */
            await this.nodeWorker.paymentRequest(req, res);
        });

        this.app.get("/api/disconnect", async (req, res) => {
            /**
             * GET /api/disconnect
             * Disconnect from all gRPC services. It's important to disconnect
             * from the lnd node once you have finished using it. This will free
             * up any open handles that could prevent your application from
             * properly closing.
             */
            await this.nodeWorker.disconnect(req, res);
        });
    }
}
