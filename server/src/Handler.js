import packageJson from "../package.json" assert { type: "json" };
export default class Handler {
    constructor() {}

    process() {
        console.log(`Begin ${packageJson.name} process..`);
    }
}
