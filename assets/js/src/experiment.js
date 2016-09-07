// RP: listen john, i still feel weird about this.  i mean, you saw the video, didn't you?
// JD: yeah man, but it's a gig, and right now, i need a gig

$(document).ready(function() {
	$("#sf-trigger-video").on("ended", function() {
		// RP: this should be secure enough, doubt there's any master hackers out there
		document.location.href = "/secure/questions";
	});
});
