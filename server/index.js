import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import axios from "axios";
import Handler from "./src/Handler.js";
import config from "./config/config.js";

const app = express();
const PORT = 4000;
const workerUrl = config.connections.dockerUserDefinedNetwork.worker;
const handler = new Handler();

app.use(cors());
app.use(bodyParser.json());

/**
 * Axios handlers
 */
const sendGetRequest = async (url, route = "/") => {
    try {
        // const resp = await axios(`${url}${route}`, {
        //     timeout: config.defaultTimeout, // Override the default timeout
        //     method: "GET",
        // });
        // console.log(resp.data);
        // return resp.data;

        const res = await fetch(`${url}${route}`);
        // headers: {
        // Accept: 'application/json',
        // },
        // signal: AbortSignal.timeout(config.defaultTimeout),

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Fetch failed to return a response");
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        throw err;
    }
};

/**
 * Express route handlers
 */
app.get("/", async (req, res) => {
    // const url = `${workerUrl}/`;
    try {
        // const response = await fetch(url);
        // const json = await response.json();
        const axiosResp = await sendGetRequest(workerUrl);
        res.send({
            // message: "Hello World",
            // message: json.message,
            data: axiosResp,
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
    try {
        const axiosResp = await sendGetRequest(workerUrl, "/api/connect");
        res.send({
            data: axiosResp,
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
    try {
        const axiosResp = await sendGetRequest(workerUrl, "/api/info");
        res.send({
            data: axiosResp,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/payment/:id/invoice", async () => {
    /**
     * GET /api/payment/:id/invoice
     * server request to worker to send a payment for a lightning invoice request
     */
    try {
        const axiosResponse = await sendGetRequest(
            workerUrl,
            "/api/payment/:id/invoice"
        );
        res.send({
            data: axiosResponse,
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
    try {
        const axiosResp = await sendGetRequest(workerUrl, "/api/disconnect");
        res.send({
            data: axiosResp,
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(4000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
