const DeviceInfo = require("../_Constants");
const BuildConfig = require("../BuildConfig");
const ApiDispatcher = require("./ApiDispatcher");

class OSUpdateProvider {
	apiDispatcher;

	constructor() {
		this.apiDispatcher = new ApiDispatcher();
	}

	/**
	 * Fetch a list of OS releases.
	 *
	 * @param {string} appScopedAccessToken
	 * @param {string} deviceAccessToken
	 * @param {int} managedMode
	 * @param {boolean} doFullUpdate
	 * @returns the network response containing the firmware details
	 */
	fetchOSReleases(appScopedAccessToken, deviceAccessToken, managedMode, doFullUpdate) {
		return this.apiDispatcher.getMobileReleaseUpdates(
			this.getOSReleasesParams(appScopedAccessToken, deviceAccessToken, managedMode, doFullUpdate)
		);
	}

	/**
	 * Generate the parameters for the network request.
	 *
	 * @param {string} appScopedAccessToken
	 * @param {string} deviceAccessToken
	 * @param {int} managedMode
	 * @param {boolean} doFullUpdate
	 * @returns
	 */
	getOSReleasesParams(appScopedAccessToken, deviceAccessToken, managedMode, doFullUpdate) {
		const graphQl = this.getGraphQl(doFullUpdate, managedMode);

		if (!appScopedAccessToken) {
			appScopedAccessToken = "OC|3733290306686872|";
		}

		if (!deviceAccessToken) {
			deviceAccessToken = BuildConfig.PROVIDER_SUFFIX;
		}

		return {
			graphQl: graphQl,
			channelAppId: "399374017083309",
			accessToken: appScopedAccessToken,
			deviceAccessToken: deviceAccessToken,
			deviceManagedMode: managedMode,
		};
	}

	/**
	 * Builds the GraphQL query for a firmware check.
	 *
	 * @param {boolean} doFullUpdate
	 * @param {int} managedMode
	 * @returns the graphql query string
	 */
	getGraphQl(doFullUpdate, managedMode) {
		const deviceType = "ota." + DeviceInfo.getDeviceType().replace("-", ".").replace("_", ".");
		const deviceSerial = DeviceInfo.getDeviceSerial();
		const version = DeviceInfo.getDeviceVersion();
		const deviceSdkVersion = DeviceInfo.getDeviceSdkVersion();
		const securePatchDate = DeviceInfo.getSecurePatchDate();
		console.info(
			`Querying for OTA packages, managedMode: ${managedMode}, deviceType: ${deviceType}, version: ${version}, useFullUpdate: ${doFullUpdate}`
		);

		const securityPathTime = securePatchDate ? securePatchDate : "undefined";
		if (doFullUpdate) {
			return `update_interval,ota.device_type(${deviceType}).device_serial(${deviceSerial}).sdk_version(${deviceSdkVersion}).version(${version}).rollout_token(${"FullOnly"}).fullbuild(true).security_patch_time(${securityPathTime}){download_uri,target_version,base_version,install_options,file_checksum,release_channel_id,release_channel_name}`;
		} else {
			return `update_interval,ota.device_type(${deviceType}).device_serial(${deviceSerial}).sdk_version(${deviceSdkVersion}).version(${version}).security_patch_time(${securityPathTime}){download_uri,target_version,base_version,install_options,file_checksum,release_channel_id,release_channel_name}`;
		}
	}
}

module.exports = OSUpdateProvider;
