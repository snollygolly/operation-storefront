"use strict";

const config = require("./config.json");

require("appdynamics").profile({
	controllerHostName: "evilmousestudios.saas.appdynamics.com",
	controllerPort: 443,
	accountName: config.plugins.appdynamics.account_name,
	accountAccessKey: config.plugins.appdynamics.account_access_key,
	applicationName: config.plugins.appdynamics.application_name,
	tierName: config.plugins.appdynamics.tier_name,
	nodeName: "process"
});

const koa = require("koa");
const hbs = require("koa-hbs");
const serve = require("koa-static-folder");

// for passport support
const session = require("koa-generic-session");
const bodyParser = require("koa-bodyparser");
const redis = require("koa-redis");

const app = koa();

exports.app = app;

// misc handlebars helpers
require("./helpers/handlebars");

// trust proxy
app.proxy = true;

// sessions
app.keys = [config.site.secret];
app.use(session({
	key: "gd-sf.sid",
	prefix: "gd-sf:sess:",
	cookie: {maxAge: 1000 * 60 * 60 * 24},
	store : redis()
}));

// body parser
app.use(bodyParser());

// statically serve assets
app.use(serve("./assets"));

// load up the handlebars middlewear
app.use(hbs.middleware({

	viewPath: `${__dirname}/views`,
	layoutsPath: `${__dirname}/views/layouts`,
	partialsPath: `${__dirname}/views/partials`,
	defaultLayout: "main"
}));

app.use(function* error(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit("error", err, this);
	}
});

require("./routes");

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on("SIGINT", function exit() {
	process.exit();
});
