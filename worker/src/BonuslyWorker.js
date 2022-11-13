import config from "../config/config.js";
export default class NodeWorker {
    constructor() {
        this.config = config;
    }

    async connect(req, res) {
        // console.log(`grpc.state: ${this.grpc.state}`);
        // res.send({
        //     message: `grpc is now connected, state: ${this.grpc.state}`,
        // });
    }

    async getUsers(req, res, route) {
        /**
         * Get a list of your company's users.
         * https://bonus.ly/api/v1/users?access_token=d84e66e776450f8b7bbf90b74976fb35
         */
        let url = `${this.config.connections.bonuslyApi?.host}${route}`;
        // let url =
        //     "https://bonus.ly/api/v1/users?access_token=d84e66e776450f8b7bbf90b74976fb35";
        try {
            const response = await this.sendGetRequest(url);
            res.send({
                data: response,
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * fetch handlers
     */
    async sendGetRequest(url) {
        const options = {
            method: "get",
            headers: new Headers({
                Authorization: `Bearer ${this.config.connections.bonuslyApi?.accessToken}`,
            }),
        };
        const res = await fetch(url, options);
        // const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            console.log(`data: ${data}`);
            return data;
        } else {
            console.log("Error: Fetch attempt failed");
        }
    }
}
