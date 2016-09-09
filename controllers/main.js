"use strict";

const log = require("../helpers/logging");

const Subject = require("../models/subject");
const Message = require("../models/message");

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
	yield this.render("sign_up_closed");
};

module.exports.signUpSubmit = function* signUpSubmit() {
	return this.throw(400, "The research study is no longer accepting applicants");
	// some basic error checking
	if (!this.request.body.sf_email_address) {
		return this.throw(400, "You must provide an email address");
	}
	// save the email into a shorter var
	const email = this.request.body.sf_email_address;
	if (isEmail(email) === false) {
		return this.throw(400, "You must provide a valid email address");
	}
	// check to see if this subject already exists
	const subjectExists = yield Subject.checkSubject(email);
	if (subjectExists === true) {
		return this.throw(400, "You are already enrolled in the study");
	}
	const document = yield Subject.newSubject(email);
	if (document.error === true) {
		return this.throw(500, document.message);
	}
	log.info(`Successfully signed up ${email}`);
	yield this.render("sign_up_success", {
		email: email
	});
};

module.exports.login = function* login() {
	yield this.render("login", {
		script: "login"
	});
};

module.exports.loginSubmit = function* loginSubmit() {
	// some basic error checking
	if (!this.request.body.sf_email_address) {
		return this.throw(400, "You must provide a email address");
	}
	if (!this.request.body.sf_token) {
		return this.throw(400, "You must provide a token");
	}
	// save the email into a shorter var
	const email = this.request.body.sf_email_address;
	log.info(`${email} attempted to log in`);
	if (isEmail(email) === false) {
		return this.throw(400, "You must provide a valid email address");
	}
	// check to see if is even a token
	const token = this.request.body.sf_token;
	if (token.length !== 36) {
		return this.throw(400, "You must provide a valid token");
	}
	const document = yield Subject.getSubject(email);
	if (document.error === true) {
		return this.throw(400, "No user found with that email address");
	}
	if (document.token !== token || document.id !== email) {
		return this.throw(400, "Incorrect email or token");
	}
	// we're authed, do some session stuff here!
	this.session.email = email;
	this.session.token = token;
	log.info(`${email} logged in successfully`);
	yield this.render("login_success", {
		email: email
	});
};

module.exports.contactSubmit = function* contactSubmit() {
	// some basic error checking
	if (!this.request.body.contact_email_address) {
		return this.throw(400, "You must provide a email address");
	}
	// save the email into a shorter var
	const email = this.request.body.contact_email_address;
	if (isEmail(email) === false) {
		return this.throw(400, "You must provide a valid email address");
	}
	if (!this.request.body.contact_message) {
		return this.throw(400, "You must provide a message");
	}
	// sanitize the input
	const message = this.request.body.contact_message.replace(/[^\w\s]/gi, "");
	// set it back
	this.request.body.contact_message = message;
	if (!this.request.body.contact_important) {
		return this.throw(400, "You must agree that this message is important");
	}
	const document = yield Message.newMessage(this.request.body);
	if (document.error === true) {
		return this.throw(500, document.message);
	}
	log.info(`${email} sent us a message`);
	yield this.render("contact_success", {
		email: email
	});
};

function isEmail(email) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
