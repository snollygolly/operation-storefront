var answers = [];
$(document).ready(function() {

	$("#submit").on("click", function(e) {
		e.preventDefault();
		var submit = confirm("Are you sure you want to submit your answers?");
		if(submit == true) {
			getAnswers();
			postAnswers();
		}
	});
});

function postAnswers() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/secure/questions",
		data: {answers: answers},
	}).done(function(result) {
		if (result.error === true) {
			alert(result.message);
			return console.error(result.message);
		}
			// Success!
			$(location).attr("href","/secure");
	}).fail(function(err) {
		// Failure
		alert("We're very sorry, something has gone awry. Please try again later.");
		console.error(err);
	});
}

function getAnswers() {
	answers.push($("#sf-good-person").val());
	answers.push($("#sf-good-person-bad-things").val());
	answers.push($("#sf-you-bad-things").val());
	answers.push($("#sf-you-hurt-someone").val());
	answers.push($("#sf-you-kill-someone").val());
	answers.push($("#sf-you-want-kill-someone").val());
	answers.push($("#sf-you-are-your-own-person").val());
	answers.push($("#sf-tree-bird").val());
	answers.push($("#sf-scared").val());
	answers.push($("#sf-really-scared").val());
	answers.push($("#sf-really-scared-now").val());
	answers.push($("#sf-watched").val());
	answers.push($("#sf-watched-now").val());
	answers.push($("#sf-bird-tree").val());
}
