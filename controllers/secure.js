"use strict";

const Subject = require("../models/subject");
const s3 = require("../helpers/s3");

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
	const video = s3.getURL("storefront-trigger-video-3931.mp4");
	console.log(video);
	// proceed with logic
	yield this.render("secure/experiment", {
		script: "secure/experiment",
		video: video
	});
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
