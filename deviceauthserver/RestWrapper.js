const axios = require("axios");

class RestWrapper {
	constructor(context, host, port) {
		this.serverHost = host;
		this.serverPort = port;
	}

	getUrl(path) {
		return `https://${this.serverHost}:${this.serverPort}${path}`;
	}

	send(path, params) {
		return axios.post(this.getUrl(path), params, {
			headers: {
				// see G:\oculus-apks\Oculus_OS_Updater\Oculus_OS_Updater_OSUpdater_source_from_JADX\sources\com\oculus\http\core\interceptor\ApiInterceptor.java for headers
				"Accept-Language": "en-US",
				"X-ANDROID-ID": "0000000000000000", // padded with 16 0's. If android_id is null, simply 16 zero's
				"X-Build-Model": "fake_placeholder",
				"X-Build-Number": "283560485", // CORRECT, from the manifest
				"X-Oculus-Feature": "1", // CORRECT
				"oculus-request-id": "567e0fc7-ab4d-41aa-9b20-3346498e264b", // random uuid
				"User-Agent": "Oculus Quest 2 27.0.0.44.512", // idk this is random
				"Content-Type": "application/json",
			},
		});
	}
}

module.exports = RestWrapper;
