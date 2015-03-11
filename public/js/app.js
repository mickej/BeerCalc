$(document).ready(function() {
	var max_fields      = 10; //maximum input boxes allowed
	var wrapper         = $(".input_fields_wrap"); //Fields wrapper
	var add_button      = $(".add_field_button"); //Add button ID
	var hop_field       = $(".hop").clone()

	var remove = function(e) {
		e.preventDefault();
		$(this).closest(".hop").remove();
	}

	var calcformKeyup = function(e) {
		$.get("/calc", $("#calcform").serialize(), function(data) {
			$("#title").html(data.total);
			wrapper.find(".result").each( function(i) {
				$(this).text(data.calcs[i]);
			});
		});
	}

	$(add_button).click(function(e){ //on add input button click
		e.preventDefault();
		var added = hop_field.clone().appendTo(wrapper);
		added.on("click", ".remove_field", remove);
		$("input[type=text]", added).on("keyup", calcformKeyup);
	});

	$(".hop").on("click", ".remove_field", remove);

	$("input[type=text]").on("keyup", calcformKeyup);
});
