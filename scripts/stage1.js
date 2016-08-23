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
		const subject = subjects.pop();
		const message = yield sendEmail(subject, false);
	}
	// loop through the subject to send email to them
	for (const subject of subjects) {
		const message = yield sendEmail(subject, true);
	}
	console.log(subjects);

}).catch((err) => {
	console.error(err);
});

function* sendEmail(subject, accepted) {
	const acceptSubject = "Research Study Information";
	const acceptEmail = `Hello,<br><br>

	We’re pleased to inform you that you’ve been accepted into our
research study. A username and password has been created for you.
Please login at the following address to start the experiment. We look
forward to your participation.<br><br>

<a href="http://graydeanresearch.com/login">Secure Subject Portal Login</a><br><br>

Username: ${subject.id}<br>
Password: ${subject.value}<br><br>

<strong>Gray and Dean Research</strong> | Department of Acquisitions`;
	const declineSubject = "Research Study Information";
	const declineEmail = `Hello,<br><br>

	We're sorry to inform you that you have not been accepted into our study.  Not everyone is a good fit for our study, and based on a number of factors (that we unfortunately can't disclose), we don't believe you would be beneficial to the study.  Thank you for your interest.<br><br>

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
