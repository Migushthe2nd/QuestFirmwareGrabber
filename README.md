# Oculus Quest Firmware Grabber

An implementation Oculus' firmware update services from the Oculus Quest 2 in nodejs.
Features were reverse engineered using the official packages.

It is currently able to fetch Enterprise firmware from `graph.oculus.com`.
In order to fetch consumer firmwares, a device certificate is required, which can only be obtained using root access. The key and cert in [./data](./data) were generated to test if the server would allow unknown certificates. It did not work, however, I have not thoroughly tested it.

## Usage

To quickly test the program:

```sh
yarn

yarn run dev
```

OR to create a custom implementation:

```js
const OSUpdateManager = require("./updater/OSUpdateManager");

const updateManager = new OSUpdateManager();
updateManager
	.performUpdateCheck(2, true)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.error(e);
	});
```

See how to use `performUpdateCheck()` [here](./updater/OSUpdateManager.js#L18-L24)

You can also change [the updater constants](./updater/_Constants.js) to change details about the request.

## Example response

This is the response for manageMode `2` and doFullUpdate `true`:

```json
{
	"update_interval": 240,
	"ota": [
		{
			"download_uri": "https://scontent.fams1-1.fna.fbcdn.net/v/t39.10537-6/10000000_266653938419055_8628851085981989398_n.zip?_nc_cat=109&ccb=1-3&_nc_sid=053bd2&_nc_ohc=OglSvGcpHPEAX_x8Yh3&_nc_ad=z-m&_nc_cid=0&_nc_zor=4&_nc_ht=scontent.fams1-1.fna&oh=36f436e37ab4ab3671effdd001c40b20&oe=60A50C2D",
			"target_version": "13969800116100000",
			"base_version": "13969800116100000",
			"install_options": {
				"headers": "FILE_HASH=HQnOsMKjoqP88SE0CBSL8i78mqVJDNKJTwD+6ATJDLc=\\nFILE_SIZE=850625394\\nMETADATA_HASH=YPvW7DY2LYfyjOEcG7pwYf\\/uVRB4YBvvRfXFm8R\\/fA8=\\nMETADATA_SIZE=61529\\n",
				"size": 850625394,
				"offset": 40234,
				"type": "hollywood"
			},
			"file_checksum": "07178554e5c893bd17937d7928eddc128caebb65c7d4a300f9dc439588b9966b",
			"release_channel_id": "799750157222373",
			"release_channel_name": "Miramar Enterprise OTA Public"
		}
	]
}
```

## Todo

_See [`./deviceauthserver/README.md`](./deviceauthserver/README.md) and [`./updater/README.md`](./updater/README.md)_
