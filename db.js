var mongoose = require("mongoose");
var api = {};

mongoose.connect(process.env.MONGO_FRONTBIN || "mongodb://localhost/test");

var noteSchema = mongoose.Schema({
	text: { type: String, default: ""},
	updated_at: Date,
	created_at: Date
});

var Note = mongoose.model("note", noteSchema)

api.get = function (id, callback) {
	Note.findById(id, function (err, note) {
		if (err) callback(err, null);
		if (!note) callback("Not found", null);
		else callback(null, note);
	});
}

api.update = function (id, text, callback) {
	Note.findByIdAndUpdate(id, {
		text: text
	}, callback);
}

api.save = function (text, callback) {
	var n = new Note({
		text: text
	});
	n.save(callback);
}

noteSchema.pre("save", function(next){
	now = new Date();
	this.updated_at = now;
	if ( !this.created_at ) {
		this.created_at = now;
	}
	next();
});

module.exports = api;