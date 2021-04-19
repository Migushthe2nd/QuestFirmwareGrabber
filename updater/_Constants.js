/**
 * These can be obtained via ADB shell getprop.
 * This file is not part of the original code.
 */
const deviceInfo = {
	/**
	 * @returns ro.build.flavor OR "unknown" originally
	 */
	getDeviceType() {
		return "hollywood-user"; //
	},
	/**
	 * @returns ro.boot.serialno originally
	 */
	getDeviceSerial() {
		return "1WXXXXXXXXXX66"; //
	},
	/**
	 * The server only returns the first next version
	 * latest v27 is 15280600195700000
	 *
	 * @returns ro.build.version.incremental originally
	 */
	getDeviceVersion() {
		return "0";
	},
	/**
	 * @returns ro.build.version.sdk originally
	 */
	getDeviceSdkVersion() {
		return "29"; //
	},
	/**
	 * @returns ro.build.version.security_patch OR "undefined" originally
	 */
	getSecurePatchDate() {
		return "2020-08-05";
	},
};

module.exports = deviceInfo;
