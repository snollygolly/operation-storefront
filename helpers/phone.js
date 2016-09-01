const config = require("../config.json");

const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const client = Promise.promisifyAll(require("twilio")(config.plugins.twilio.account_sid, config.plugins.twilio.auth_token));

exports.makeCall = function* makeCall(number) {
	try {
		const call = yield client.makeCall({
			to: `+1${number}`,
			from: `+1${config.plugins.twilio.from_number}`,
			url: "http://graydeanresearch.com/assets/sounds/call.twiml",
			method: "GET"
		});
		call.error = false;
		return call;
	} catch (err) {
		return {
			error: true,
			message: `Phone: ${err.message}`
		};
	}
};
