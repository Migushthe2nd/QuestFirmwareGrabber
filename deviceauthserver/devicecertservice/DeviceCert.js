const fs = require("fs");
/**
 * Communicates with the vendor.oculus.hardware.devicecert@1.0::IDeviceCert HIDL
 * Path: /vendor/lib64/vendor.oculus.hardware.devicecert@1.0.so
 */

class DeviceCert {
	CERTFILE_EXTENSION = ".crt";
	KEYFILE_EXTENSION = ".key";
	PROVISIONING_BASE_DIR = "./data/"; // originally "/persist/provisioning/"
	SecureState = Object.freeze({
		CURRENT: "CURRENT",
		SECURE: "SECURE",
		INSECURE: "INSECURE",
	});

	constructor() {}

	/**
	 * Returns an X509 Certificate fetched from the DeviceCertService.
	 * Here simply reads a file and returns the X509 file.
	 * @param {string} alias
	 * @param {SecureState} state
	 * @returns the certificate buffer
	 */
	loadCertificate(alias, state) {
		// TODO, these certificates have to be the actual certificate from /persist
		return fs.readFileSync(this.PROVISIONING_BASE_DIR + alias + this.CERTFILE_EXTENSION);
	}
}

module.exports = DeviceCert;
