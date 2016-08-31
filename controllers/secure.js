"use strict";

const Subject = require("../models/subject");
const s3 = require("../helpers/s3");
const qs = require("../models/questions.json");
const ans = require("../models/questions");

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

	if (this.session.answered == true) {
		return yield this.render("error", {
			message: "You have already answered the questionairre"
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
	yield this.render("secure/questions", {
		script: "secure/questions",
		data: qs
	});
};

module.exports.submit = function* questions() {
	const params = this.request.body;
	if (!params.answers) {
		this.status = 400;
		return this.body = {error: true, message: "Answers were not found!"};
	}
	const saveAnswers = yield ans.saveAnswers(this.session.id, params.answers);
	if (saveAnswers.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}
	// save answered to session.
	this.session.answered = true;
	// return result
	return this.body = saveAnswers;
};
