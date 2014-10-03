var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var app = express();

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "public/tab.html"));
});

app.use(express.static("public"));

app.listen(3000);