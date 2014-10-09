$(document).ready(function () {

	window.$textarea = $("#beautify");
	window.$results = $("#results");
	window.loaded = {};
	window.saveToUpdate = false;

	var executeAfter = function ($btn, callback) {
		var path = $btn.attr("data-require");
		if (path && path.length && !window.loaded[path]) {
			var nanobar = new Nanobar();
			nanobar.go(30);
			$.getScript("js/" + path).done(function () {
				console.log("Script Loaded success: " + "js/" + path);
				window.loaded[path] = true;
				nanobar.go(100);
				callback();
			}).fail(function (jq) {
				alert("Script was not loaded because" + jq);
			});
		} else {
			callback();
		}
	}

	$("#btn-beautify").on("click", function () {
		hide();
		var js = cm.getValue();
		if(!js.length)	return false;
		executeAfter($(this), function () {
			cm.setOption("mode", "text/javascript");
			cm.setValue(js_beautify(js));
		});
	});

	$("#btn-html").on("click", function () {
		hide();
		var html = cm.getValue();
		if(!html.length)	return false;
		executeAfter($(this), function () {
			cm.setOption("mode", "text/html");
			cm.setValue(style_html(html));
		});
	});

	$("#btn-css").on("click", function () {
		hide();
		var css = cm.getValue();
		if(!css.length)	 return false;
		executeAfter($(this), function () {
			cm.setOption("mode", "text/css");
			cm.setValue(css_beautify(css));
		});
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
		if (!js.length) return false;
		executeAfter($(this), function () {
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
		executeAfter($(this), function () {
			cm.setValue(JSON.minify(js));
		});
	});

	$("#reset").on("click", reset);

	$("#renderhtml").on("click", function () {
		hide();
		showPreview();
		updateHtml();
	});

	$("#rendermd").on("click", function () {
		hide();
		executeAfter($(this), function () {
			showPreview();
			updateMarkdown();
		});
	});

	$("#save").on("click", function () {
		if (window.saveToUpdate) {
			saveText(cm.getValue());
			clearTimeout(window.saveDelay);
		} else {
			newText(cm.getValue());
			startSaving();
		}
	});

	$("#twitter-share").on("click", function () {
		var shareLink = "https://twitter.com/home?status=" + encodeURIComponent("Frontbin | jsonlint, jshint, pastebin, beautify js, markdown renderer, html renderer, dencoder all in one place ") + encodeURIComponent(window.location.href) + encodeURIComponent("?utm_source=twitter");
		$(this).attr("href", shareLink);
	});

	$("#fb-share").on("click", function () {
		var shareLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href) + encodeURIComponent("?utm_source=facebook");
		$(this).attr("href", shareLink);
	});

	$("#previous").on("click", function () {
		$("#sidebar").toggle();
	});

	init();
});

function init () {
	initCM();
	getText();
	showSaved();
	nanobar.go(100);
	setTimeout(function () {
		$(".share").hide();
	}, 0);
}

function getText () {
	if (window.location.hash.length < 2) return false;
	var path = window.location.hash;
	var arr = path.split("/");
	if (arr.length !== 3) return false;
	else {
		$.ajax({
			url: arr[1] + "/" + arr[2],
			method: "get"
		}).done(function (res, status) {
			if (status === "success") {
				onSave();
				cm.setValue(res.text);
			} else {
				alert(res.error || "Something went wrong");
			}
		}).fail(failAjax);
	}
}

function saveText (text) {
	var nanobar = new Nanobar();
	nanobar.go(30);
	if (window.location.hash.length < 2) return false;
	var path = window.location.hash;
	var arr = path.split("/");
	if (arr.length !== 3) return false;
	else {
		$.ajax({
			url: arr[1] + "/" + arr[2],
			method: "post",
			dataType: "json",
			data: {
				text: text
			}
		}).done(function (res, status) {
			nanobar.go(100);
			if (status === "success") {
				onSave();
				saveToLocal();
			} else {
				alert(res.error || "Something went wrong");
			}
		}).fail(failAjax);
	}
}

function onSave () {
	window.saveToUpdate = true;
	$("#save").text("Update");
	$(".share").show();
}

function newText (text) {
	var nanobar = new Nanobar();
	nanobar.go(30);
	$.ajax({
		url: "/note",
		method: "POST",
		dataType: "json",
		data: {
			text: cm.getValue()
		}
	}).done(function (res, status) {
		nanobar.go(100);
		if (status === "success") {
			changeState("#!/note/" + res._id);
			onSave();
		} else {
			alert(res.error || "Something went wrong");
		}
	}).fail(failAjax);
}

function failAjax (jqXHR, status, err) {
	console.log(jqXHR, status, err);
	alert(err || "Something went wrong");
}

function changeState(path) {
	if (typeof(window.history.pushState) == 'function') {
		window.history.pushState(null, path, path);
	} else {
		window.location.hash = path;
	}
}

function updateHtml() {
	window.render = "html";
	window.sidebyside = true;
	writeToPreview(cm.getValue());
	setTimeout(updatePreview, 300);
}

function showPreview() {
	$("#render-wrapper").show();
	$("#textarea-wrapper").removeClass("col-xs-10").addClass("col-xs-5");
}

function updatePreview () {
	var value = window.render === "html" ? cm.getValue() : marked(cm.getValue());
	writeToPreview(value);
}

function writeToPreview (value) {
	var previewFrame = document.getElementById("preview");
	var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
	preview.open();
	preview.write(value);
	preview.close();
}

function updateMarkdown() {
	window.render = "md";
	window.sidebyside = true;
	writeToPreview(cm.getValue());
	setTimeout(updatePreview, 300);
}

function reset() {
	window.cm.setValue("");
	window.sidebyside = false;
	hide();
	cm.focus();
}

function hide() {
	$results.removeClass("error notice success").hide();
	$("#render-wrapper").hide();
	$("#textarea-wrapper").addClass("col-xs-10").removeClass("col-xs-5");
}

function initCM() {
	window.delay;
	window.sidebyside = false;
	window.cm = CodeMirror.fromTextArea(document.getElementById("beautify"), {
		mode: "text/html",
		lineNumbers: true,
		gutter: true,
		viewportMargin: Infinity
	});
	window.cm.on("change", function() {
		if (window.sidebyside) {
			clearTimeout(window.delay);
			window.delay = setTimeout(updatePreview, 300);
		}
		startSaving();
	});
}

function startSaving () {
	if (window.saveToUpdate) {
		clearTimeout(window.saveDelay);
		window.saveDelay = setTimeout(function () {
			saveText(cm.getValue());
		}, 300);
	}
}

function showSaved () {
	if (window.localStorage.getItem("quickbin")) {
		var list = "";
		var arr = JSON.parse(window.localStorage.getItem("quickbin"));
		arr.forEach(function (item) {
			list += "<li><a href='/#!/note/" + item + "'>" + item + "</a></li>";
		});
		console.log(list);
		$("#sidebar").html(list);
	} else {
		window.localStorage.setItem("quickbin", JSON.stringify([]));
	}
}

function saveToLocal() {
	if (window.location.hash.length < 2) return false;
	var path = window.location.hash;
	var arr = path.split("/");
	if (arr.length !== 3) return false;

	if (window.localStorage.getItem("quickbin")) {
		var list = JSON.parse(window.localStorage.getItem("quickbin"));
		if (list.indexOf(arr[2]) === -1) {
			list.push(arr[2]);
			$("#sidebar").append("<li><a href='/#!/note/" + arr[2] + "'>" + arr[2] + "</a></li>");
			window.localStorage.setItem("quickbin", JSON.stringify(list));
		}
	} else {
		window.localStorage.setItem("quickbin", JSON.stringify([arr[2]]));
	}
}