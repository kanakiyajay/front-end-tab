$(document).ready(function () {

	window.$textarea = $("#beautify");
	window.$results = $("#results");

	$("#btn-beautify").on("click", function () {
		hide();
		var js = cm.getValue();
		if(!js.length)	return false;
		cm.setOption("mode", "text/javascript");
		cm.setValue(js_beautify(js));
	});

	$("#btn-html").on("click", function () {
		hide();
		var html = cm.getValue();
		if(!html.length)	return false;
		cm.setOption("mode", "text/html");
		cm.setValue(style_html(html));
	});

	$("#btn-css").on("click", function () {
		hide();
		var css = cm.getValue();
		if(!css.length)	 return false;
			cm.setOption("mode", "text/css");
			cm.setValue(css_beautify(css));
	});

	$("#decode").on("click", function () {
		hide();
		var encoded = cm.getValue();
		if(encoded.length) cm.setValue(decodeURIComponent(encoded.replace(/\+/g, " ")));
	});

	$("#encode").on("click", function () {
		hide();
		var unencoded = cm.getValue();
		if(unencoded.length) cm.setValue(encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22"));
	});

	$("#jshint").on("click", function () {
		hide();
		var js = cm.getValue();
		var status = JSHINT(js);
		if (status) {
			$results.addClass("success").show().html("No Jshint errors")
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
			$results.addClass("error").show().html(html);
		}
	});

	$("#whitespace").on("click", function () {
		hide();
		var js = cm.getValue();
		if (!js.length) return false;
		try {
			JSON.parse(js);
		} catch (e) {
			var code = js.replace(/\s/g, "");
			cm.setValue(code);
			return;
		}
		cm.setValue(JSON.minify(js));
	});

	$("#reset").on("click", reset);

	$("#renderhtml").on("click", function () {
		hide();
		showPreview();
		updateHtml();
	});

	$("#rendermd").on("click", function () {
		hide();
		showPreview();
		updateMarkdown();
	});

	initCM();
	resetCM();
	initClipboard();
});

function updateHtml() {
	var previewFrame = document.getElementById("preview");
	var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
	preview.open();
	preview.write(cm.getValue());
	preview.close();
}

function showPreview() {
	$("#render-wrapper").show();
	$("#textarea-wrapper").removeClass("col-xs-10").addClass("col-xs-5");
}

function updateMarkdown() {
	var previewFrame = document.getElementById("preview");
	var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
	preview.open();
	preview.write(marked(cm.getValue()));
	preview.close();
}

function reset() {
	hide();
	cm.focus();
	resetCM();
}

function hide() {
	$results.removeClass("error notice success").hide();
	$("#render-wrapper").hide();
	$("#textarea-wrapper").addClass("col-xs-10").removeClass("col-xs-5");
}

function initCM() {
	window.cm = CodeMirror.fromTextArea(document.getElementById("beautify"), {
		mode: "text/html",
		lineNumbers: true,
		gutter: true,
		viewportMargin: Infinity
	});
}

function resetCM() {
	var minLines = 10;
	var startingValue = "";
	for (var i = 1; i < minLines; i++) {
		startingValue += "\n";
	}
	cm.setValue(startingValue);
}

/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-33060097-3']);
_gaq.push(['_setDomainName', 'jaykanakiya.com']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
*/