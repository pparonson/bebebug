import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import LndGrpc from "lnd-grpc";
import config from "./config/config.js";

const app = express();
const PORT = 5000;
const grpc = new LndGrpc({
    lndconnectUri: config?.connections?.lndConnect?.grpc?.adminMacaroonUri,
});

app.use(cors());
app.use(bodyParser.json());

/**
 * Express route handlers
 */
app.get("/", (req, res) => {
    res.send({
        message: "Worker service is ready",
    });
});

app.get("/api/connect", async (req, res) => {
    /**
     * GET /api/connect
     */
    await grpc.connect();

    console.log(`grpc.state: ${grpc.state}`);
    res.send({ message: `grpc is now connected, state: ${grpc.state}` });
});

app.get("/api/info", async (req, res) => {
    /**
     * GET /api/info
     * get the Lightning Node info
     */
    console.log(`grpc.state: ${grpc.state}`);

    // await grpc.activateLightning();
    const { Lightning } = grpc.services;

    // const balance = await Lightning.walletBalance();
    const info = await Lightning.getInfo();
    console.log(JSON.stringify(info, null, 2));

    res.send({ message: `Lightning: ${JSON.stringify(info, null, 2)}` });
});

app.get("/api/payment/:id/invoice", async () => {
    /**
     * POST /api/payment/:id/invoice
     * send a payment for a lightning invoice request
     */
    console.log(`grpc.state: ${grpc.state}`);

    let request = {
        payment_request: req.body.paymentRequest,
        timeout_seconds: config.defaultTimeout,
    };

    await grpc.connect();

    let call = await grpc.services.Router.sendPaymentV2(request);

    call.on("data", (response) => {
        console.log(`Payment response: ${JSON.stringify(response, null, 2)}`);
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

app.listen(5000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
