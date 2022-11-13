import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Handler from "./src/Handler.js";
import config from "./config/config.js";

const app = express();
const PORT = config.connections.dockerUserDefinedNetwork?.worker?.port;

app.use(cors());
app.use(bodyParser.json());

/**
 * TODO: attach grpc to a session life cycle for scalability?
 */
const handler = new Handler(app);

app.listen(PORT, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

handler.process();
