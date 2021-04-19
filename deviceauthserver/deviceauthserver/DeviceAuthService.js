const DeviceAuthenticator = require("./DeviceAuthenticator");

class DeviceAuthService {
	deviceAuthenticator;

	constructor() {
		this.deviceAuthenticator = new DeviceAuthenticator();
	}

	/**
	 * Fetch the device token
	 * @param {string} applicationClientToken unused, since the TrustedCallerVerifier is used (checks package + signature)
	 * @returns the device token
	 */
	async getDeviceAuthToken(applicationClientToken) {
		console.log("getDeviceAuthToken called");
		const credentials = await this.deviceAuthenticator.fetchCredentials();
		if (credentials) {
			return credentials.token.value;
		}
		return null;
	}
}

module.exports = DeviceAuthService;
