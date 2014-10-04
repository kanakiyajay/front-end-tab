var bodyParser = require('body-parser')
var express = require("express");
var path = require("path");
var db = require("./db.js");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "public/tab.html"));
});

app.post("/note", function (req, res, next) {
	if (!req.body.text.length) next("Zero length");
	db.save(req.body.text, function (err, note) {
		if (err) next(err);
		else res.json(note);
	});
});

app.post("/note/:id", function (req, res, next) {
	if (!req.body.text.length) next("Zero length");
	db.update(req.params.id, req.body.text, function (err, note) {
		if (err) next(err);
		else res.json(note);
	});
});

app.get("/note/:id", function (req, res, next) {
	db.get(req.params.id, function (err, note) {
		if (err) next(err);
		else res.json(note);
	});
});

app.use(function (err, req, res, next) {
	console.log(err);
	res.json({
		"error": err || "Something Broke"
	})
});

app.use(express.static("public"));

app.listen(3000);
console.log("Listening on 3000");