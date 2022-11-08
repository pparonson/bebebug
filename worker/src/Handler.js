import config from "../config/config.js";
import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app, grpc) {
        this.app = app;
        this.grpc = grpc;
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
        /**
         * Express route handlers
         */
        this.app.get("/", (req, res) => {
            res.send({
                message: "Worker service is ready",
            });
        });

        this.app.get("/api/connect", async (req, res) => {
            /**
             * GET /api/connect
             */
            await this.grpc.connect();

            console.log(`grpc.state: ${this.grpc.state}`);
            res.send({
                message: `grpc is now connected, state: ${this.grpc.state}`,
            });
        });

        this.app.get("/api/info", async (req, res) => {
            /**
             * GET /api/info
             * get the Lightning Node info
             */
            console.log(`grpc.state: ${this.grpc.state}`);

            const { Lightning } = this.grpc.services;

            // const balance = await Lightning.walletBalance();
            const info = await Lightning.getInfo();
            console.log(JSON.stringify(info, null, 2));

            res.send({
                message: `Lightning: ${JSON.stringify(info, null, 2)}`,
            });
        });

        this.app.get("/api/payment/:id/invoice", async () => {
            /**
             * POST /api/payment/:id/invoice
             * send a payment for a lightning invoice request
             */
            console.log(`grpc.state: ${this.grpc.state}`);

            let request = {
                payment_request: req.body.paymentRequest,
                timeout_seconds: config.defaultTimeout,
            };

            await this.grpc.connect();

            let call = await this.grpc.services.Router.sendPaymentV2(request);

            call.on("data", (response) => {
                console.log(
                    `Payment response: ${JSON.stringify(response, null, 2)}`
                );
                if (response.status.toLowerCase() === "succeeded") {
                    res.send(response);
                }
            });

            call.on("status", (status) => {
                // The current status of the stream.
                console.log(`Payment stream status: ${status}`);
            });
            call.on("end", async () => {
                // The server has closed the stream.
                console.log(
                    "Payment stream has ended.  It is okay to disconnect."
                );
                // Disconnect from all services.
                // await this.grpc.disconnect();
            });
        });

        this.app.get("/api/disconnect", async (req, res) => {
            /**
             * GET /api/disconnect
             * Disconnect from all gRPC services. It's important to disconnect
             * from the lnd node once you have finished using it. This will free
             * up any open handles that could prevent your application from
             * properly closing.
             */
            console.log(`grpc.state: ${this.grpc.state}`);

            await this.grpc.disconnect();
            res.send({ message: "grpc is now disconnected" });
        });
    }
}
