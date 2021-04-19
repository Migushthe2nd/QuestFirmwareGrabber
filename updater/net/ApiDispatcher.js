const axios = require("axios");

class ApiDispatcher {
	/**
	 * Execute the generated query
	 * @param {string} params
	 */
	getMobileReleaseUpdates(params) {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios({
					method: "GET",
					url: "https://graph.oculus.com/mobile_release_updates", // from G:\oculus-apks\Oculus_OS_Updater\Oculus_OS_Updater_OSUpdater_source_from_JADX\sources\com\oculus\http\core\endpoint\EndpointModule.java
					headers: {
						// see G:\oculus-apks\Oculus_OS_Updater\Oculus_OS_Updater_OSUpdater_source_from_JADX\sources\com\oculus\http\core\interceptor\ApiInterceptor.java for headers
						"Accept-Language": "en-US",
						"X-ANDROID-ID": "0000000000000000", // padded with 16 0's. If android_id is null, simply 16 zero's
						"X-Build-Model": "fake_placeholder", // a default value somewhere
						"X-Build-Number": "283560485", // CORRECT, from the manifest
						"X-Oculus-Feature": "1", // CORRECT
						"oculus-request-id": "567e0fc7-ab4d-41aa-9b20-3346498e264b", // random uuid
						"User-Agent": "Oculus Quest 2 27.0.0.44.512", // idk this is random
					},
					params: {
						fields: params.graphQl,
						channel_app_id: params.channelAppId,
						access_token: params.accessToken,
						device_access_token: params.deviceAccessToken,
						device_managed_mode: params.deviceManagedMode,
					},
				});
				resolve(res.data);
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = ApiDispatcher;
