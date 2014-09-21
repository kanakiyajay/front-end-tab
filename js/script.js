$(document).ready(function () {

	var $textarea = $("#beautify");

	$textarea.linedtextarea();

	$("#btn-beautify").on("click", function () {
		var js = $textarea.val();
		if(js.length)	$textarea.val(js_beautify(js));
	});

	$("#btn-html").on("click", function () {
		var html = $textarea.val();
		if(html.length)	$textarea.val(style_html(html));
	});

	$("#btn-css").on("click", function () {
		var css = $textarea.val();
		if(css.length)	$textarea.val(css_beautify(css));
	});

	$("#decode").on("click", function () {
		var encoded = $textarea.val();
		if(encoded.length) $textarea.val(decodeURIComponent(encoded.replace(/\+/g, " ")));
	});

	$("#encode").on("click", function () {
		var unencoded = $textarea.val();
		if(unencoded.length) $textarea.val(encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22"));
	});

	$("#jshint").on("click", function () {
		var js = $textarea.val();
		var status = JSHINT(js);
		if (status) {
			$("#results").addClass("success").show().html("No Jshint errors")
			return false;
		} else {
			var html = JSHINT.errors.length + " Warnings\n\n";
			for (var i = 0; i < JSHINT.errors.length; i++) {
				var error = JSHINT.errors[i];
				html += "Line " + error.line + ", char " + error.character + " : " + error.reason + "\n";
			};
			if (JSHINT.undefs.length) {
				html += JSHINT.undefs.length + " Undefined\n";
				for (var i = 0; i < JSHINT.undefs.length; i++) {
					var undef = JSHINT.undefs[i];
					html += "var " + undef[3] + " is undefined at Line " + undef[2].line + ", character " + undef[2].character + "\n";
				};
			}
			$("#results").addClass("error").show().html(html);
		}
	});

	$("#reset").on("click", reset);

	function reset () {
		$textarea.val('').focus();
		$("#results").removeClass("error notice success").hide();
	}
});

 var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-33060097-3']);
_gaq.push(['_setDomainName', 'jaykanakiya.com']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();