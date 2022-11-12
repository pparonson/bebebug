import config from "../config/config.js";
import Routes from "./Routes.js";
import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app, grpc) {
        this.app = app;
        this.grpc = grpc;
        this.config = config;
        this.routes = new Routes(app, grpc);
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
        /**
         * Express route handlers
         */
        this.app.get("/", async (req, res) => {
            await this.routes.probe(req, res, "/");
        });

        this.app.get("/api/connect", async (req, res) => {
            /**
             * GET /api/connect
             */
            await this.routes.connect(req, res, "/api/connect");
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * get the Lightning Node info
             */
            await this.routes.getInfo(req, res);
        });

        this.app.post("/api/payment/:id", async (req, res) => {
            /**
             * POST /api/payment
             * send a payment for a lightning invoice request
             */
            await this.routes.paymentRequest(req, res);
        });

        this.app.get("/api/disconnect", async (req, res) => {
            /**
             * GET /api/disconnect
             * Disconnect from all gRPC services. It's important to disconnect
             * from the lnd node once you have finished using it. This will free
             * up any open handles that could prevent your application from
             * properly closing.
             */
            await this.routes.disconnect(req, res);
        });
    }
}
