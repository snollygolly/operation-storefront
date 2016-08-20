"use strict";

const Subject = require("../models/subject");

module.exports.index = function* index() {
	// error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}
	const subject = yield Subject.getSubject(this.session.email);
	if (subject.error === true) {
		return yield this.render("error", {
			message: "You must be enrolled in the study"
		});
	}
	if (subject.token !== this.session.token) {
		return yield this.render("error", {
			message: "Bad credentials"
		});
	}
	// proceed with logic
	yield this.render("secure/index");
};

module.exports.experiment = function* experiment() {
	// error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}
	const subject = yield Subject.getSubject(this.session.email);
	if (subject.error === true) {
		return yield this.render("error", {
			message: "You must be enrolled in the study"
		});
	}
	if (subject.token !== this.session.token) {
		return yield this.render("error", {
			message: "Bad credentials"
		});
	}
	// proceed with logic
	yield this.render("secure/experiment");
};

module.exports.questions = function* questions() {
	// error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}
	const subject = yield Subject.getSubject(this.session.email);
	if (subject.error === true) {
		return yield this.render("error", {
			message: "You must be enrolled in the study"
		});
	}
	if (subject.token !== this.session.token) {
		return yield this.render("error", {
			message: "Bad credentials"
		});
	}
	// proceed with logic
	yield this.render("secure/questions");
};
