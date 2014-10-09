var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var db = require("./db.js");
var app = express();

/* For Performance */
require("http").globalAgent.maxSockets = Infinity;

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
	});
});

app.use(express.static(path.join(__dirname, "public")));

/* To prevent unknown errors */
process.on("uncaughtException", function (err) {
	console.log(err);
});

var port = process.env.NODE_PORT || 3000;
app.listen(port);
console.log("Listening on " + port);