const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const config = require("./config/config");

const app = express();
const PORT = 4000;
const workerUrl = config.connections.dockerUserDefinedNetwork.worker;

app.use(cors());
app.use(bodyParser.json());

/**
 * Express route handlers
 */
app.get("/", async (req, res) => {
    const url = `${workerUrl}/`;
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

app.get("/api/connect", async (req, res) => {
    /**
     * GET /api/connect
     * server request to worker to request connection to lightning node
     */
    const url = `${workerUrl}/api/connect`;
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
     * server request to worker to request lightning node info/status
     */
    const url = `${workerUrl}/api/info`;
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

app.get("/api/disconnect", async (req, res) => {
    /**
     * GET /api/disconnect
     * server request to worker to request to terminate connection to lightning node
     */
    const url = `${workerUrl}/api/connect`;
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
