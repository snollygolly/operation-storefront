// RP: this is fucking creepy, and i don't like it
// JD: rick, i've been here for long enough to kind of figure out how things work.  don't ask questions
// RP: yeah, but john, someone has to, don't they?
// JD: don't ask question rick, i'm serious

$(document).ready(function() {

	$("#sf-submit").on("click", function(e) {
		e.preventDefault();
		// make sure they've answered all the questions
		var totalQuestions = $(".sf-question").length;
		var answeredQuestions = $("input[class='sf-answer']:checked").length;
		if (totalQuestions !== answeredQuestions) {
			return alert("You must answer all the questions");
		}
		$("#sf-questions").submit();
	});
});
