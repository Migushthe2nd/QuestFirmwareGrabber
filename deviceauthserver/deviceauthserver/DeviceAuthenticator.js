const constants = require("./Constants");
const DeviceAuth = require("../devicecertservice/DeviceAuth");
const DeviceAuthStore = require("./DeviceAuthStore");

class DeviceAuthenticator {
	authService;
	authStore;

	constructor() {
		this.authService = new DeviceAuth();
		this.authStore = new DeviceAuthStore();
	}

	async fetchCredentials(credentials) {
		const lastCred = this.authStore.getCredentials();
		if (lastCred) {
			return lastCred;
		}

		const newCred = await this.authService.authenticate(constants.DEVICE_AUTH_SERVICE_ACCESS_TOKEN, credentials);
		this.authStore.loadCredentials(newCred);
		return newCred;
	}
}

module.exports = DeviceAuthenticator;
