"use strict";

const db = require("../helpers/db");

module.exports = {
	saveAnswers: function* saveAnswers(id, qs) {
		const answers = {
			id: id,
			answers: qs
		};

		const document = yield db.saveDocument(answers, "answers");
		return document;
	}
};
