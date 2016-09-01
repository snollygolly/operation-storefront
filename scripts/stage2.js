/*
Stage 2:
- Looks through all subjects who are in stage 3 (it makes sense, trust me)
- These are subjects who have watched the video, answered the questions, and given us their number
- They haven't yet received a phone call, so now it's time for that
*/

"use strict";

const Subject = require("../models/subject");
const phone = require("../helpers/phone");

const co = require("co");

// how many people get in
const ACCEPT_PERC = 0.00;

co(function* co() {
	// get all the subjects that are currently on this stage
	const response = yield Subject.getSubjectsByStage(3);
	if (response.error === true) {
		throw new Error("Getting view threw an error");
	}
	const subjects = response.results;
	// everyone gets the phone call first
	console.log(`* Preparing to call ${subjects.length} subjects`);
	for (const subject of subjects) {
		const call = yield phone.makeCall(subject.value.phone);
		if (call.error === true) {
			throw new Error(call.message);
		}
		// set the stage to indicate that we called
		const document = yield Subject.setStage(subject.id, 4);
		if (document.error === true) {
			throw new Error(document.message);
		}
		console.log(`* Call to ${subject.value.phone} successful!`);
	}
}).catch((err) => {
	console.error(err);
});
