// RP: john, did you button up that password issue dean was having?
// JD: i mean, kinda.  i just switched us to seeded UUIDs and now they can't change the password
// RP: good god, the users are going to hate you

$( document ).ready(function() {
	$("#sf-login").on("click", function(e) {
		e.preventDefault();
		// make sure they gave us a valid email address
		var subjectEmail = $("input[name='sf_email_address']").val();
		if (subjectEmail.length <= 5 || isEmail(subjectEmail) === false) {
			return alert("You must provide a valid email address");
		}
		// make sure they gave us a formatted token
		var subjectEmail = $("input[name='sf_token']").val();
		if (subjectEmail.length != 36) {
			return alert("You must provide a valid token");
		}
		$("#sf-form").submit();
	});
});

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
