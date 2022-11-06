import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import LndGrpc from "lnd-grpc";
import config from "./config/config.js";

const app = express();
const PORT = 5000;
const grpc = new LndGrpc({
    lndconnectUri: config?.connections?.lndConnect?.grpc?.adminMacroonUri,
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

    console.log(grpc.state);
    res.send({ message: `grpc is now connected, state: ${grpc.state}` });
});

app.get("/api/info", async (req, res) => {
    /**
     * GET /api/info
     * get the Lightning Node balance and other info
     */
    console.log(grpc.state);

    // Make some api calls...
    const { Lightning, Autopilot, Invoices } = grpc.services;

    // Fetch current balance.
    const balance = await Lightning.walletBalance();
    // const info = await Lightning.getInfo();

    res.send({ message: `Balance: ${JSON.stringify(balance, null, 2)}` });
});

app.get("/api/disconnect", async (req, res) => {
    /**
     * GET /api/disconnect
     * Disconnect from all gRPC services. It's important to disconnect
     * from the lnd node once you have finished using it. This will free
     * up any open handles that could prevent your application from
     * properly closing.
     */
    console.log(grpc.state);

    await grpc.disconnect();
    res.send({ message: "grpc is now disconnected" });
});

app.listen(5000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
