const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("../config/config");
const fetch = require("node-fetch");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

console.log(`config: ${config}`);

const LndGrpc = require("lnd-grpc");

const grpc = new LndGrpc({
    lndconnectUri: config.connections?.lndConnect?.grpc?.adminMacroonUri,
});

/**
 * Express route handlers
 */
app.get("/", async (req, res) => {
    // res.send("Hello World");

    const url = `${config.connections.dockerUserDefinedNetwork.worker}/`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        res.send({ message: json.message, status: json.type });
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/info", async () => {
    /**
     * GET /api/info
     */
    console.log("BEGIN getInfo()");

    // await grpc.connect();
    // console.log(grpc.state);
    // res.send(grpc.state);

    // call worker to request worker to call lightning node
    // const url = "http://worker:4000/api/info";
    const url = `${config.connections.dockerUserDefinedNetwork.worker}/api/info`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        res.send({ message: json.message, status: json.type });
    } catch (error) {
        console.log(error);
    }
});

app.listen(4000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
