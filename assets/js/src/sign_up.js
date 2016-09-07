// JD: rick, make sure you minify this shit before you serve it
// RP: john, you know I will! when have I not?
// JD: just saying rick, if you push this live without making sure it's clean, gray will be PISSED
// RP: what's he gonna do? kill me? lol
// JD: there are things worse than death rick, you should know that by now.	just make sure storefront is buttoned up, seriously

$( document ).ready(function() {
	$("#sf-signup").on("click", function(e) {
		e.preventDefault();
		// check to make sure they understand that they will be watched
		var consentWatched = $("input[name='sf_agree_watch']:checked").length;
		if (consentWatched !== 1) {
			return alert("You must consent to being monitored throughout the duration of the experiment");
		}
		// check to make sure they understand that they won't be paid
		var understandNoPay = $("input[name='sf_understand_not_paid']:checked").length;
		if (understandNoPay !== 1) {
			return alert("You must indicate that you understand that you may not be compensated until the exeriment's criteria are met");
		}
		// check to make sure they understand that we are not culpable for their actions
		var notCulpable = $("input[name='sf_not_culpable']:checked").length;
		if (notCulpable !== 1) {
			return alert("You must believe that you are your own person");
		}
		// make sure they gave us a valid email address
		var subjectEmail = $("input[name='sf_email_address']").val().toLowerCase();
		if (subjectEmail.length <= 5 || isEmail(subjectEmail) === false) {
			return alert("You must provide a valid email address");
		}
		$("#sf-form").submit();
	});
});

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
