"use strict";

const db = require("../helpers/db");
const questionsJSON = require("../models/questions.json");

module.exports = {
	saveAllAnswers: function* saveAllAnswers(id, answers) {
		const answerDoc = {
			id: id,
			answers: answers
		};
		const document = yield db.saveDocument(answerDoc, "answers");
		return document;
	},
	isValidQuestion: (id) => {
		for (const question of questionsJSON) {
			if (id === question.id) { return true; }
		}
		return false;
	},
	isValidAnswer: (id, answer) => {
		for (const question of questionsJSON) {
			for (const value of question.answers) {
				if (answer === value) { return true; }
			}
		}
		return false;
	}
};
