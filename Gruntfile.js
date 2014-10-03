module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				seperator: ";"
			},
			dist: {
				src: ["js/jquery-2.1.0.min.js", "js/jsl.parser.js", "js/jsl.interactions.js", "js/codemirror.js", "js/css/css.js", "js/xml/xml.js", "js/htmlmixed/htmlmixed.js", "js/javascript/javascript.js", "js/script.js"],
				dest: "js/minified.js"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};