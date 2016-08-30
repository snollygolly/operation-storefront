$(document).ready(function() {
	$("#sf-trigger-video").on("ended", function() {
		// RP: this should be secure enough, doubt there's any master hackers out there :P
		document.location.href = "/secure/questions";
	});
});
