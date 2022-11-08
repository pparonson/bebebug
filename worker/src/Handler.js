import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app, grpc) {
        this.app = app;
        this.grpc = grpc;
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
    }
}
