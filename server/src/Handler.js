import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor() {}

    process() {
        // TODO: dynamically describe service from version.json
        console.log(`Begin ${packageJson.name} process..`);
    }
}
