const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	transport: "ses",
	accessKeyId: config.plugins.ses.access_key,
	secretAccessKey: config.plugins.ses.secret_key
});

exports.sendMail = function* sendMail(message) {
	try {
		const data = {
			from: "donotreply@graydeanresearch.com",
			to: message.rcpt,
			subject: message.subject,
			html: message.body
		};
		const info = yield transporter.sendMail(data);
		info.error = false;
		return info;
	} catch (err) {
		return {
			error: true,
			message: `Email: Send of [${message.rcpt} - ${message.subject}] failed`
		};
	}
};
