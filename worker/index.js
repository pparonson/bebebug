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

app.listen(PORT, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
