const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

// const LndGrpc = require("lnd-grpc");

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
    // console.log("BEGIN getInfo()");
    // const grpc = new LndGrpc({
    //     lndconnectUri:
    //         "lndconnect://127.0.0.1:10001?cert=MIICJjCCAc2gAwIBAgIRAOltkfkMF2l6F_YYoQ_SnTIwCgYIKoZIzj0EAwIwMTEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEOMAwGA1UEAxMFYWxpY2UwHhcNMjIwODExMjEwNTU3WhcNMjMxMDA2MjEwNTU3WjAxMR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MQ4wDAYDVQQDEwVhbGljZTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABOwkAz0Js8ZHnyxX5NYbGrp-PuWyoXOz98XHNS16l_8hr3Mb7yjN0j3LReKZj9zUR6nUaj0c-IU5GIGc3x3KpgGjgcUwgcIwDgYDVR0PAQH_BAQDAgKkMBMGA1UdJQQMMAoGCCsGAQUFBwMBMA8GA1UdEwEB_wQFMAMBAf8wHQYDVR0OBBYEFJS5FSPqtw-oJZybttUM-pFXFfUiMGsGA1UdEQRkMGKCBWFsaWNlgglsb2NhbGhvc3SCBWFsaWNlgg5wb2xhci1uNC1hbGljZYIEdW5peIIKdW5peHBhY2tldIIHYnVmY29ubocEfwAAAYcQAAAAAAAAAAAAAAAAAAAAAYcErBQAAjAKBggqhkjOPQQDAgNHADBEAiBycJKvte_IvaTbhahwa65Ux294bwtNAmHSRLV8Bnj93gIgBulGD39ZwK4L-0s8evyG1d7su542Thdh7er5kCgpZoc&macaroon=AgEDbG5kAvgBAwoQCIbSxfenIg62ObaXYAPFehIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgayjXw6gX012qd_nMc2BXVkqNxTBv2mORACvJnwX7bNo",
    // });
    // await grpc.connect();
    // console.log(grpc.state);
});

app.listen(4000, (err) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
