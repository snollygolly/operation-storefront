"use strict";

const Subject = require("../models/subject");
const s3 = require("../helpers/s3");
const questionsJSON = require("../models/questions.json");
const Question = require("../models/questions");

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

	if (this.session.answered === true) {
		return yield this.render("error", {
			message: "You have already answered the questionnaire"
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
		questions: questionsJSON
	});
};

module.exports.questionsSubmit = function* questionsSubmit() {
	// some basic error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}

	if (this.session.answered === true) {
		return yield this.render("error", {
			message: "You have already answered the questions"
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
	if (subject.stage !== 2) {
		return yield this.render("error", {
			message: "You are in the wrong stage"
		});
	}
	// loop through each ID of each answer they provided and make sure it's valid
	for (const answer in this.request.body) {
		// if this isn't a valid id, bounce them
		if (Question.isValidQuestion(answer) !== true) {
			return yield this.render("error", {
				message: "All questions must be valid"
			});
		}
		if (Question.isValidAnswer(answer, this.request.body[answer]) !== true) {
			return yield this.render("error", {
				message: "All answers must be valid"
			});
		}
	}
	// actually save the results
	const document = yield Question.saveAllAnswers(this.session.id, this.request.body);
	if (document.error === true) {
		return yield this.render("error", {
			message: "Something went wrong saving your questions"
		});
	}
	// save answered to session.
	this.session.answered = true;
	// return result
	yield this.render("secure/questions_success", {});
};

module.exports.phone = function* phone() {
	// error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}

	if (this.session.answered !== true) {
		return yield this.render("error", {
			message: "You must answer the questionnaire first"
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
	yield this.render("secure/phone", {
		script: "secure/phone"
	});
};

module.exports.phoneSubmit = function* phoneSubmit() {
	// some basic error checking
	if (!this.session.email || !this.session.token) {
		return yield this.render("error", {
			message: "You must be authenticated"
		});
	}
	if (this.session.answered !== true) {
		return yield this.render("error", {
			message: "You must answer the questionnaire first"
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
	if (subject.stage !== 2) {
		return yield this.render("error", {
			message: "You are in the wrong stage"
		});
	}
	if (!this.request.body.sf_phone_number) {
		return yield this.render("error", {
			message: "You must provide a phone number"
		});
	}
	// super basic checking for the phone number because i'm tired
	if (this.request.body.sf_phone_number.length !== 14) {
		return yield this.render("error", {
			message: "You must provide a valid phone number"
		});
	}
	// all error checks pass
	const document = yield Subject.setPhoneNumber(this.session.email, this.request.body.sf_phone_number);
	if (document.error === true) {
		return yield this.render("error", {
			message: document.message
		});
	}
	// return result
	yield this.render("secure/phone_success", {});
};
