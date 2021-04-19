const OSUpdateManager = require("./updater/OSUpdateManager");

const updateManager = new OSUpdateManager();
updateManager
	.performUpdateCheck(2, true) // 0 = consumer, 2 = enterprise ("Miramar Enterprise OTA Public")
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.error(e);
	});
