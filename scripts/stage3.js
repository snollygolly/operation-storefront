/*
Stage 3:
- Looks through all subjects that have received a phone call (on stage 4, yes, it still makes sense)
- Accepts / rejects based on current subject load
- Notifies both on their status once it has been decided
*/

"use strict";

const Subject = require("../models/subject");
const email = require("../helpers/email");

const co = require("co");

// how many people get in
const ACCEPT_PERC = 0.00;

co(function* co() {
	// get all the subjects that are currently on this stage
	const response = yield Subject.getSubjectsByStage(4);
	if (response.error === true) {
		throw new Error("Getting view threw an error");
	}
	const subjects = response.results;
	// see how many there are first of all
	const totalSubjects = subjects.length;
	// see how many are actually getting in
	const acceptedSubjects = Math.ceil(ACCEPT_PERC * totalSubjects);
	console.log(`* ${acceptedSubjects}/${totalSubjects} accepted into phase 2 of study`);
	// now prune subjects that didn't make the cut (FIFO)
	while (subjects.length > acceptedSubjects) {
		const subject = subjects.pop();
		// tell them via email that they didn't make it
		const message = yield sendEmail(subject, false);
		const document = yield Subject.terminateSubject(subject.id);
	}
	// loop through the subject to send email to them
	for (const subject of subjects) {
		const message = yield sendEmail(subject, true);
		// now update the DB with each accepted subject
		const document = yield Subject.setStage(subject.id, 5);
		if (document.error === true) {
			throw new Error(document.message);
		}
	}
	console.log(`* ${totalSubjects} notified via email`);
}).catch((err) => {
	console.error(err);
});

function* sendEmail(subject, accepted) {
	const acceptSubject = "Research Study Information - Reminder";
	const acceptEmail = `Subject,<br><br>

	We'd first like to thank you for participating in our research study.  Your experience and input will be immeasurably helpful in our research.  We'd like to remind you, that in order for you to be eligible for compensation, you must complete both experiments on our secure subject portal.  Failure to complete both may result in disqualification.<br><br>

<strong>Gray and Dean Research</strong> | Department of Acquisitions`;
	const declineSubject = "Research Study Information - Update";
	const declineEmail = `Hello,<br><br>

	We're sorry to inform you that you will not be moving forward to phase 2 of our research study.  Not everyone is right for the kind of work we do, and unfortunately, you didn't respond in the way needed for you to progress to the next phase.  We thank you for your time.<br><br>

<strong>Gray and Dean Research</strong> | Department of Compensation`;

	const message = yield email.sendMail({
		rcpt: subject.id,
		subject: (accepted === true) ? acceptSubject : declineSubject,
		body: (accepted === true) ? acceptEmail : declineEmail
	});
	if (message.error === true) {
		throw new Error(message.message);
	}
}
