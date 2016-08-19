"use strict";

const Subject = require("../models/subject");

module.exports.index = function* index() {
	yield this.render("index");
};

module.exports.aboutUs = function* aboutUs() {
	yield this.render("about_us");
};

module.exports.contactUs = function* contactUs() {
	yield this.render("contact_us");
};

module.exports.jobs = function* jobs() {
	yield this.render("jobs");
};

module.exports.signUp = function* signUp() {
	yield this.render("sign_up", {
		script: "sign_up"
	});
};

module.exports.signUpSubmit = function* signUpSubmit() {
	// some basic error checking
	if (!this.request.body.sf_email_address) {
		return yield this.render("sign_up_error", {
			message: "You must provide a email address"
		});
	}
	// save the email into a shorter var
	const email = this.request.body.sf_email_address;
	if (isEmail(email) === false) {
		return yield this.render("sign_up_error", {
			message: "You must provide a valid email address"
		});
	}
	// check to see if this subject already exists
	const subjectExists = yield Subject.checkSubject(email);
	if (subjectExists === true) {
		return yield this.render("sign_up_error", {
			message: "You are already enrolled in the study"
		});
	}
	const document = yield Subject.newSubject(email);
	if (document.error === true) {
		return yield this.render("sign_up_error", {
			message: document.message
		});
	}
	yield this.render("sign_up_success", {
		email: email
	});
};

module.exports.signUpConfirm = function* signUpConfirm() {
	yield this.render("sign_up");
};

module.exports.login = function* login() {
	yield this.render("login");
};

function isEmail(email) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
