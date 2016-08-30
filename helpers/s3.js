const config = require("../config.json");
const AWS = require("aws-sdk");

const plugin = config.plugins.aws;

AWS.config.update({accessKeyId: plugin.access_key, secretAccessKey: plugin.secret_key});

const s3 = new AWS.S3();


exports.getURL = (filename) => {
	const params = {Bucket: plugin.bucket_name, Key: filename};
	try {
		// video url expires in 15min
		const url = s3.getSignedUrl("getObject", params);
		url.error = false;
		return url;
	} catch (err) {
		throw new Error(err);
		return {
			error: true,
			message: `Video: Receipt of [video - ${video}] failed`
		};
	}
};
