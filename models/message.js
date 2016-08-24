"use strict";

const db = require("../helpers/db");
const uuid = require("node-uuid");

module.exports = {
	newMessage: function* newMessage(body) {
		body.id = uuid.v4();
		const document = yield db.saveDocument(body, "messages");
		return document;
	},
	getMessage: function* getMessage(id) {
		const document = yield db.getDocument(id, "messages");
		return document;
	}
};
