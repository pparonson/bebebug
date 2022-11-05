const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const fetch = require("node-fetch");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

/**
 * Express route handlers
 */
app.get("/", async (req, res) => {
    // res.send("Hello World");

    const url = `${config.connections.dockerUserDefinedNetwork.worker}/`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        res.send({
            message: json.message,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/info", async (req, res) => {
    /**
     * GET /api/info
     */
    console.log("BEGIN getInfo()");
    // server request to worker to request lightning node info/status
    const url = `${config.connections.dockerUserDefinedNetwork.worker}/api/info`;
    try {
        const response = await fetch(url);
        const json = await response.json();

        res.send({
            message: json.message,
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(4000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
