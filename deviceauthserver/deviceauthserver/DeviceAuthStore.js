const fs = require("fs");

class DeviceAuthStore {
	CREDENTIALS_PATH = "./data/credentials.json";
	credentials = null;

	constructor() {
		this.loadCredentials();
	}

	/**
	 * Load the credentials either from the last session by obtaining new keys.
	 * Normally this does not requrest new values synchronously, but for the sake of simplicity it does here.
	 */
	loadCredentials() {
		if (fs.existsSync(this.CREDENTIALS_PATH)) {
			this.credentials = JSON.parse(fs.readFileSync(this.CREDENTIALS_PATH, "utf8"));
		}
		// else {
		// 	this.credentials = {
		// 		entId: null,
		// 		token: {
		// 			value: null,
		// 		},
		// 		bootCount: -1,
		// 		elapsedRealtime: -1,
		// 	};
		// }
	}

	/**
	 * Get the latest valid credentials.
	 * @returns the latest credentials
	 */
	getCredentials() {
		return this.credentials;
	}

	/**
	 * Store new credentials that were fetched from the server.
	 * @param {object} credentials
	 */
	setCredentials(credentials) {
		this.credentials = credentials;

		fs.writeFile(this.CREDENTIALS_PATH, JSON.stringify(credentials, null, 4), { flag: "wx" }, function (err) {
			if (err) throw err;
			console.log("It's saved!");
		});
	}
}

module.exports = DeviceAuthStore;
