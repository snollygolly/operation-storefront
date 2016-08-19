"use strict";

const config = require("../config.json");

module.exports.index = function* index() {
	yield this.render("index", {
		title: config.site.name
	});
};

module.exports.aboutUs = function* aboutUs() {
	yield this.render("about_us", {
		title: config.site.name
	});
};

module.exports.contactUs = function* contactUs() {
	yield this.render("contact_us", {
		title: config.site.name
	});
};

module.exports.jobs = function* jobs() {
	yield this.render("jobs", {
		title: config.site.name
	});
};

module.exports.signUp = function* signUp() {
	yield this.render("sign_up", {
		script: "sign_up"
	});
};

module.exports.login = function* login() {
	yield this.render("login", {
		title: config.site.name
	});
};
