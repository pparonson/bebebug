const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

/**
 * Express route handlers
 */
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(4000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
