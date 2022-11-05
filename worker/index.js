const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("../config/config");

const LndGrpc = require("lnd-grpc");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

const grpc = new LndGrpc({
    lndconnectUri: config?.connections?.lndConnect?.grpc?.adminMacroonUri,
});

/**
 * Express route handlers
 */
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/info", async () => {
    /**
     * GET /api/info
     */
    console.log("BEGIN getInfo()");

    await grpc.connect();
    console.log(grpc.state);

    res.send(grpc.state);
});

app.listen(5000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
