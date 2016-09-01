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
	},
	getSubject: function* getSubject(email) {
		const document = yield db.getDocument(email, "subjects");
		return document;
	},
	getSubjectsByStage: function* getSubjectsByStage(stage) {
		const subjects = yield db.runView("listings/stage", stage, "subjects");
		return subjects;
	},
	setStage: function* setStage(id, stage) {
		const document = yield db.getDocument(id, "subjects");
		if (document.error === true) {
			return document;
		}
		document.stage = stage;
		const confirmation = yield db.saveDocument(document, "subjects");
		return confirmation;
	},
	setPhoneNumber: function* setPhoneNumber(id, phone) {
		const document = yield db.getDocument(id, "subjects");
		if (document.error === true) {
			return document;
		}
		document.phone = phone;
		document.stage = 3;
		const confirmation = yield db.saveDocument(document, "subjects");
		return confirmation;
	}
};
