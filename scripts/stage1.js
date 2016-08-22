/*
Stage 1:
- Looks through all subjects that have requested to join, but aren't yet in
- Accepts / rejects based on current subject load
- Notifies both on their status once it has been decided
*/

"use strict";

const Subject = require("../models/subject");
const email = require("../helpers/email");

const co = require("co");

// how many people get in
const ACCEPT_PERC = 1.00;

co(function* co() {
	// get all the subjects that are currently on this stage
	const response = yield Subject.getSubjectsByStage(1);
	if (response.error === true) {
		throw new Error("Getting view threw an error");
	}
	const subjects = response.results;
	// see how many there are first of all
	const totalSubjects = subjects.length;
	// see how many are actually getting in
	const acceptedSubjects = Math.ceil(ACCEPT_PERC * totalSubjects);
	// now prune subjects that didn't make the cut (FIFO)
	while (subjects.length > acceptedSubjects) {
		subjects.pop();
	}

	console.log(subjects);

}).catch((err) => {
	console.error(err);
});

function* sendEmail(subject, accepted) {

}
