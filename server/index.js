import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Handler from "./src/Handler.js";
import config from "./config/config.js";

const app = express();
const PORT = config.connections.dockerUserDefinedNetwork?.server?.port;

app.use(cors());
app.use(bodyParser.json());

const handler = new Handler(app);

/**
 * Axios handlers
 */
const sendGetRequest = async (url, route = "/") => {
    try {
        const res = await fetch(`${url}${route}`, {
            signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Fetch failed to return a response");
            return {
                status: 500,
                message: "Fetch failed to return a response",
            };
        }
    } catch (error) {
        if (error.name === "TimeoutError") {
            console.error(`Error: TimeoutError - ${config.defaultTimeout} ms`);
        } else if (error.name === "AbortError") {
            console.error(
                "Fetch aborted by user action (browser stop button, closing tab, etc."
            );
        } else if (error.name === "TypeError") {
            console.error("AbortSignal.timeout() method is not supported");
        } else {
            // A network error, or some other problem.
            console.error(
                `Error: type: ${error.name}, message: ${error.message}`
            );
        }
    }
};

/**
 * Express route handlers
 */
app.get("/", async (req, res) => {
    const worker = config.connections.dockerUserDefinedNetwork?.worker;
    const url = `${worker?.url}:${worker?.port}`;
    try {
        const response = await sendGetRequest(url);
        res.send({
            data: response,
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

app.listen(PORT, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
