import config from "../config/config.js";
import LndGrpc from "lnd-grpc";
export default class NodeWorker {
    constructor() {
        this.grpc = {};
        this.config = config;
    }

    async connect(req, res) {
        this.grpc = new LndGrpc({
            lndconnectUri:
                this.config?.connections?.lightningNode?.lndConnect?.grpc
                    ?.adminMacaroonUri?.local,
            // lndconnectUri:
            //     this.config?.connections?.lightningNode?.lndConnect?.grpc
            //         ?.adminMacaroonUri?.dev,
        });
        await this.grpc.connect();

        console.log(`grpc.state: ${this.grpc.state}`);

        res.send({
            message: `grpc is now connected, state: ${this.grpc.state}`,
        });
    }

    async getInfo(req, res) {
        console.log(`grpc.state: ${this.grpc.state}`);

        const { Lightning } = this.grpc.services;

        const info = await Lightning.getInfo();
        console.log(JSON.stringify(info, null, 2));

        res.send({
            message: `Lightning: ${JSON.stringify(info, null, 2)}`,
        });
    }

    async paymentRequest(req, res) {
        console.log(`grpc.state: ${this.grpc.state}`);
        console.log(`id: ${req.params.id}`);

        let request = {
            payment_request: req.body.paymentRequest,
            timeout_seconds: this.config.defaultTimeout,
        };

        await this.grpc.connect();

        let call = await this.grpc.services.Router.sendPaymentV2(request);

        call.on("data", (response) => {
            console.log(
                `Payment response: ${JSON.stringify(response, null, 2)}`
            );
            if (response?.status?.toLowerCase() === "succeeded") {
                res.send(response);
            }
        });

        call.on("status", (status) => {
            // The current status of the stream.
            console.log(`Payment stream status: ${status}`);
        });

        call.on("end", async () => {
            // The server has closed the stream.
            console.log("Payment stream has ended.  It is okay to disconnect.");
            // Disconnect from all services.
            // await grpc.disconnect();
        });
    }

    async disconnect(req, res) {
        console.log(`grpc.state: ${this.grpc.state}`);

        await this.grpc.disconnect();
        res.send({ message: "grpc is now disconnected" });
    }
}
