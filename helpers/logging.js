const config = require("../config.json");
const bunyan = require("bunyan");

let streams;

if (config.site.production !== true) {
	streams = [{
		stream: process.stdout,
		level: "trace"
	}];
} else {
	streams = [{
		type: "rotating-file",
		path: "/var/log/storefront/messages.log",
		period: "12h",
		count: 6
	}];
}

module.exports = bunyan.createLogger(
	{
		name: "GDR",
		level: "warn",
		streams: streams
	}
);
