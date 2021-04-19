const BuildConfig = require("./BuildConfig");
const OSUpdateProvider = require("./net/OSUpdateProvider");
const DeviceAuthService = require("../deviceauthserver/deviceauthserver/DeviceAuthService");

class OSUpdateManager {
	DEVICE_AUTH_TOKEN_RETRY_COUNT = 1;
	overrides = {
		fullUpdateFallbackMode: true,
		managedMode: 2,
	};
	updateProvider;

	constructor() {
		this.updateProvider = new OSUpdateProvider();
		this.deviceAuthService = new DeviceAuthService();
	}

	/**
	 * The entrypoint to the OS Updater.
	 *
	 * @param {int} managedMode what managedMode to use. 0 = consumer, 2 = enterprise ("Miramar Enterprise OTA Public")
	 * @param {boolean} doFullUpdate whether to fetch a full OTA or a delta OTA
	 * @returns an object with the plain response from graph.oculus.com, null or an error
	 */
	async performUpdateCheck(managedMode, doFullUpdate) {
		let managedMode1 = managedMode;
		if (managedMode1 === undefined) {
			managedMode1 = this.getManagedMode();
		}

		let doFullUpdate1 = doFullUpdate;
		if (doFullUpdate1 === undefined) {
			doFullUpdate1 = this.isFullUpdateFallbackMode();
		}

		let appScopedAccessToken;
		let deviceAccessToken;
		if (managedMode1 == 0) {
			appScopedAccessToken = this.getAppScopedAccessToken("1556285957737177");
			deviceAccessToken = await this.getDeviceAuthTokenWithRetry();
		}

		return this.updateProvider.fetchOSReleases(
			appScopedAccessToken,
			deviceAccessToken,
			managedMode1,
			doFullUpdate1
		);
	}

	/**
	 * Officially called getAppScopedAccessToken
	 * Gets the device token from the com.oculus.aidl.OVRServiceInterface package.
	 *
	 * Connects to com.oculus.horizon.service.OVRService
	 * @See com/oculus/updater/ovrsvcclient/OVRServiceClient.java#L107
	 *
	 * @param {string} appId
	 * @returns the app token
	 */
	getAppScopedAccessToken(appId) {
		// let str2 = null;
		// if (!connect()) {
		// 	return null;
		// }
		// try {
		// 	Bundle bundle = new Bundle();
		// 	bundle.putInt("sdk_major_version", 1);
		// 	bundle.putInt("sdk_minor_version", 1);
		// 	bundle.putString("app_id", appId);
		// 	Bundle appScopedAccessToken = this.mService.getAppScopedAccessToken(bundle);
		// 	if (isServiceError(appScopedAccessToken)) {
		// 		reportServiceError(appScopedAccessToken);
		// 	}
		// 	str2 = appScopedAccessToken.getString("access_token");
		// } catch (RemoteException e) {
		// 	try {
		// 		BLog.m53e(TAG, "error while getting access token", (Throwable) e);
		// 	} catch (Throwable th) {
		// 		disconnect();
		// 		throw th;
		// 	}
		// }
		// disconnect();
		// return str2;
	}

	/**
	 * Officially called getDeviceAuthTokenWithRetry
	 * Retries three times, else returns BuildConfig.PROVIDER_SUFFIX
	 *
	 * Connects to com.oculus.horizon.service.OVRService OR com.oculus.aidl.IDeviceAuthService, which calls com.oculus.deviceauthserver.DeviceAuthService.getDeviceAuthToken()
	 * @See com/oculus/updater/core/p010os/OSUpdateManager.java#L498
	 * @See com/oculus/auth/device/DeviceAuthTokenStore.java#L45
	 */
	async getDeviceAuthTokenWithRetry() {
		let i = 0;
		while (i < this.DEVICE_AUTH_TOKEN_RETRY_COUNT) {
			const value = await this.deviceAuthService.getDeviceAuthToken("3866e1ca90d719f060ac45dba1ea3a24");
			if (!value) {
				i++;
				continue;
			}

			console.info("device access token blocking fetch completed");
			return value;
		}
		return BuildConfig.PROVIDER_SUFFIX;
	}

	/**
	 * Whether the device is managed by an organization.
	 * Originally determined by com.oculus.os.SettingsManager "managed_device", however here it fetches properties from this.overrides
	 * @returns the default value
	 */
	getManagedMode() {
		return this.overrides.managedMode;
	}

	/**
	 * Whether to fetch a "Delta" update or a full OTA.
	 * Originally used when e.g. the source hash doesn't match, the download failed, or the installation failed and version after the update is the same as before
	 * @returns the default value
	 */
	isFullUpdateFallbackMode() {
		return this.overrides.fullUpdateFallbackMode;
	}
}

module.exports = OSUpdateManager;
