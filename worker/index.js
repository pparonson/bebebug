import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import LndGrpc from "lnd-grpc";
import Handler from "./src/Handler.js";
import config from "./config/config.js";

const app = express();
const PORT = config.connections.dockerUserDefinedNetwork?.worker?.port;
const grpc = new LndGrpc({
    lndconnectUri: config?.connections?.lndConnect?.grpc?.adminMacaroonUri,
});

app.use(cors());
app.use(bodyParser.json());

const handler = new Handler(app, grpc);

app.listen(PORT, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
