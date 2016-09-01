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
