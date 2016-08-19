"use strict";

const db = require("../helpers/db");
const uuid = require("node-uuid");

module.exports = {
	newSubject: function* newSubject(email) {
		const subject = {
			id: email,
			token: uuid.v4(),
			stage: 1
		};
		const document = yield db.saveDocument(subject, "subjects");
		return document;
	},
	checkSubject: function* checkSubject(email) {
		const document = yield db.getDocument(email, "subjects");
		if (document.error === true) {
			// they don't exist
			return false;
		}
		// they do exist
		return true;
	}
};
