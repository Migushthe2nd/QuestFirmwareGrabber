const DeviceCert = require("./DeviceCert");
const RestWrapper = require("../RestWrapper");
const { SecureState } = require("./DeviceCertInterface");

class DeviceAuth {
	ALIAS = "device_identity";
	appAccessToken;
	currentCertPem;
	deviceCert;
	restWrapper;

	constructor(context) {
		this.currentCertPem = null;
		this.deviceCert = new DeviceCert();
		this.restWrapper = new RestWrapper(context, "graph.facebook-hardware.com", 443);
	}

	getCurrentCertPem() {
		if (this.currentCertPem == null) {
			this.currentCertPem = this.getCertPem(SecureState.CURRENT);
		}
		return this.currentCertPem;
	}

	authenticate(appAccessToken, credentials) {
		return this.loginRequest(appAccessToken, credentials);
	}

	/**
	 *
	 * @param {*} appAccessToken
	 * @param {*} credentials used for the mEntId in the callback
	 */
	loginRequest(appAccessToken) {
		return new Promise(async (resolve, reject) => {
			let credentials;
			try {
				const response = await this.restWrapper.send("/login_request", {
					access_token: appAccessToken,
					device_certificate: this.getCurrentCertPem(),
				});
				console.log("/login_request SUCCESS:", response);
				credentials = "";
			} catch (e) {
				console.log("/login_request ERROR:", e.message);
				try {
					credentials = await this.register(appAccessToken);
				} catch (e2) {
					reject(e2);
				}
			}

			resolve(credentials);
		});
	}

	async register(appAccessToken) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await this.restWrapper.send("/register", {
					access_token: appAccessToken,
					device_certificates: [this.getCertPem(SecureState.INSECURE), this.getCertPem(SecureState.SECURE)],
					// TODO, these certificates have to be the actual certificate from /persist
				});
				console.log("/register SUCCESS:", response);
				resolve("idkthecredentialsshouldbehere");
			} catch (e) {
				console.log("/register ERROR:", e.request);
				console.log("/register ERROR:", e.response.data);
				// reject(e);
			}
		});
	}

	/**
	 * Reads the device cert and encodes the encoded certificate as base64.
	 * @param {SecureState} secureState
	 * @returns a base64 string of the encoded device certificate
	 */
	getCertPem(secureState) {
		const buf = this.deviceCert.loadCertificate(this.ALIAS, secureState);
		return buf.toString("base64");
	}
}

module.exports = DeviceAuth;
