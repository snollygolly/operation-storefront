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
		return yield this.render("error", {
			message: "You must provide a email address"
		});
	}
	// save the email into a shorter var
	const email = this.request.body.sf_email_address;
	if (isEmail(email) === false) {
		return yield this.render("error", {
			message: "You must provide a valid email address"
		});
	}
	// check to see if this subject already exists
	const subjectExists = yield Subject.checkSubject(email);
	if (subjectExists === true) {
		return yield this.render("error", {
			message: "You are already enrolled in the study"
		});
	}
	const document = yield Subject.newSubject(email);
	if (document.error === true) {
		return yield this.render("error", {
			message: document.message
		});
	}
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
		return yield this.render("error", {
			message: "You must provide a email address"
		});
	}
	if (!this.request.body.sf_token) {
		return yield this.render("error", {
			message: "You must provide a token"
		});
	}
	// save the email into a shorter var
	const email = this.request.body.sf_email_address;
	if (isEmail(email) === false) {
		return yield this.render("error", {
			message: "You must provide a valid email address"
		});
	}
	// check to see if is even a token
	const token = this.request.body.sf_token;
	if (token.length !== 36) {
		return yield this.render("error", {
			message: "You must provide a valid token"
		});
	}
	const document = yield Subject.getSubject(email);
	if (document.error === true) {
		return yield this.render("error", {
			message: "No user found with that email address"
		});
	}
	if (document.token !== token || document.id !== email) {
		return yield this.render("error", {
			message: "Incorrect email or token"
		});
	}
	// we're authed, do some session stuff here!
	this.session.email = email;
	this.session.token = token;
	yield this.render("login_success", {
		email: email
	});
};

module.exports.contactSubmit = function* contactSubmit() {
	// some basic error checking
	if (!this.request.body.contact_email_address) {
		return yield this.render("error", {
			message: "You must provide a email address"
		});
	}
	// save the email into a shorter var
	// const email = this.request.body.contact_email_address;
	if (isEmail(email) === false) {
		return yield this.render("error", {
			message: "You must provide a valid email address"
		});
	}
	if (!this.request.body.contact_message) {
		return yield this.render("error", {
			message: "You must provide a message"
		});
	}
	if (!this.request.body.contact_important) {
		return yield this.render("error", {
			message: "You must agree that this message is important"
		});
	}
	const document = yield Message.newMessage(this.request.body);
	if (document.error === true) {
		return yield this.render("error", {
			message: document.message
		});
	}
	yield this.render("sign_up_success", {
		email: email
	});
};

function isEmail(email) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
