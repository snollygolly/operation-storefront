$(document).ready(function() {

	$("#output").text("Please wait while the video is loaded...");

  $("#secureVid").on("ended", function() {
    // when super secret zombie video ends send zombie soldier to questions better to probably do this more securely...
    document.location.href = "/secure/questions";
  });
});
