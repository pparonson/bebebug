import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import LndGrpc from "lnd-grpc";
import Handler from "./src/Handler.js";
import config from "./config/config.js";

const app = express();
const PORT = config.connections.dockerUserDefinedNetwork?.worker?.port;
const grpc = new LndGrpc({
    lndconnectUri:
        config?.connections?.lightningNode?.lndConnect?.grpc?.adminMacaroonUri,
});

app.use(cors());
app.use(bodyParser.json());

const handler = new Handler(app, grpc);

app.get("/api/connect", async (req, res) => {
    /**
     * GET /api/connect
     */
    await grpc.connect();

    console.log(`grpc.state: ${grpc.state}`);
    res.send({
        message: `grpc is now connected, state: ${grpc.state}`,
    });
});

app.get("/api/info", async (req, res) => {
    /**
     * GET /api/info
     * get the Lightning Node info
     */
    console.log(`grpc.state: ${grpc.state}`);

    const { Lightning } = grpc.services;

    // const balance = await Lightning.walletBalance();
    const info = await Lightning.getInfo();
    console.log(JSON.stringify(info, null, 2));

    res.send({
        message: `Lightning: ${JSON.stringify(info, null, 2)}`,
    });
});

app.post("/api/payment/:id", async (req, res) => {
    /**
     * POST /api/payment
     * send a payment for a lightning invoice request
     */
    console.log(`grpc.state: ${grpc.state}`);
    console.log(`id: ${req.params.id}`);

    let request = {
        payment_request: req.body.paymentRequest,
        timeout_seconds: config.defaultTimeout,
    };

    await grpc.connect();

    let call = await grpc.services.Router.sendPaymentV2(request);

    call.on("data", (response) => {
        console.log(`Payment response: ${JSON.stringify(response, null, 2)}`);
        if (response?.status?.toLowerCase() === "succeeded") {
            res.send(response);
        }
        // else {
        // if (!response) {
        // console.log("No response");
        // } else if (response?.failure_reason) {
        // res.send({ status: 500, message: response.failure_reason });
        // } else {
        // console.log("Unknown failure");
        // }
        // }
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
});

app.get("/api/disconnect", async (req, res) => {
    /**
     * GET /api/disconnect
     * Disconnect from all gRPC services. It's important to disconnect
     * from the lnd node once you have finished using it. This will free
     * up any open handles that could prevent your application from
     * properly closing.
     */
    console.log(`grpc.state: ${grpc.state}`);

    await grpc.disconnect();
    res.send({ message: "grpc is now disconnected" });
});

app.listen(PORT, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
