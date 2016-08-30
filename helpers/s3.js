const config = require("../config.json");
const AWS = require("aws-sdk");

const plugin = config.plugins.aws;
const ext = ".mp4";
const video = "FUgR0e4pFr0817";
const fullVideo = `${video}${ext}`;

AWS.config.update({accessKeyId: plugin.access_key, secretAccessKey: plugin.secret_key});

const s3 = new AWS.S3();
const params = {Bucket: plugin.bucket_name, Key: "myKey"};

exports.getURL = function* getURL() {
	try {
		// video url expires in 15min
		const url = yield s3.getSignedUrl("getObject", params);
		console.log(url);
		url.error = false;
		return url;
	} catch (err) {
		return {
			error: true,
			message: `Video: Receipt of [video - ${video}] failed`
		};
	}
};
