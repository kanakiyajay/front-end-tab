module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				seperator: ";"
			},
			basic_and_extras: {
				files: {
					"css/concat.css": ["css/bootstrap.btn.grid.css", "css/codemirror.css", "css/style.css"],
					"js/concat.js": ["js/jquery-2.1.0.min.js", "js/jsl.parser.js", "js/jsl.interactions.js", "js/codemirror.js", "js/css/css.js", "js/xml/xml.js", "js/htmlmixed/htmlmixed.js", "js/javascript/javascript.js", "js/script.js"],
				}
			}
		},
		uglify: {
			my_target: {
				files: {
					"js/minified.js": ["js/concat.js"]
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					"css/minified.css": ["css/concat.css"]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};