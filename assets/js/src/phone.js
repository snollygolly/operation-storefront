$(document).ready(function() {
	$("#phone").mask("(000) 000-0000");

	$("#submit").on("click", function(e) {
		e.preventDefault();
		// make sure they've given us a phone number
		if ($("#phone").val().length !== 14) {
			return alert("You must provide your phone number");
		}
		$("#sf-phone").submit();
	});
});
