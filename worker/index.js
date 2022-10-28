import { Request, Response } from "express";
// import nodeManager from './node-manager';
// import db from './posts-db';
import LndGrpc from "lnd-grpc";

/**
 * POST /api/connect
 */
export const connect = async (Request, Response) => {
    // const { host, cert, macaroon } = req.body;
    // const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);
    // await db.addNode({ host, cert, macaroon, token, pubkey });
    // res.send({ token });
};

/**
 * GET /api/info
 */
export const getInfo = async (Request, Response) => {
    console.log("BEGIN getInfo()");
    const grpc = new LndGrpc({
        lndconnectUri: "",
    });

    await grpc.connect();

    console.log(grpc.state);

    // const { token } = req.body;
    // if (!token) throw new Error('Your node is not connected!');
    // // find the node that's making the request
    // const node = db.getNodeByToken(token);
    // if (!node) throw new Error('Node not found with this token');
    // // get the node's pubkey and alias
    // const rpc = nodeManager.getRpc(node.token);
    // const { alias, identityPubkey: pubkey } = await rpc.getInfo();
    // const { balance } = await rpc.channelBalance();
    // res.send({ alias, balance, pubkey });
};

// /**
//  * POST /api/posts/:id/invoice
//  */
export const postInvoice = async (Request, Response) => {
    console.log("BEGIN postInvoice");

    const grpc = new LndGrpc({
        lndconnectUri: "",
    });

    let request = {
        payment_request: req.body.paymentRequest,
        timeout_seconds: 30000,
    };

    await grpc.connect();

    /**
     * NOTE: below commented listeners do not seem to work
     */

    // Do something if we detect that the wallet is locked.
    // grpc.on(`locked`, () => console.log('wallet locked!'));

    // Do something when the wallet gets unlocked.
    // grpc.on(`active`, () => console.log('wallet unlocked!'));

    // Do something when the connection gets disconnected.
    // grpc.on(`disconnected`, () => console.log('disconnected from lnd!'));

    console.log(grpc.state);

    let call = await grpc.services.Router.sendPaymentV2(request);
    call.on("data", function (response) {
        // A response was received from the server.
        console.log(response);
        if (response.status.toLowerCase() === "succeeded") {
            // TODO: need to mark post status as paid and return with confetti
            res.send(response);
        }
    });
    call.on("status", function (status) {
        // The current status of the stream.
        console.log(status);
    });
    call.on("end", async function () {
        // The server has closed the stream.
        console.log("END");
        // Disconnect from all services.
        await grpc.disconnect();
    });
};
