import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor(app) {
        this.app = app;
    }

    process() {
        console.log(`Begin ${packageJson.name} process..`);
    }
}
