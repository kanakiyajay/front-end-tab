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
					"public/css/concat.css": ["public/css/bootstrap.btn.grid.css", "public/css/codemirror.css", "public/css/style.css"],
					"public/js/concat.js": ["public/js/jquery-2.1.0.min.js", "public/js/jsl.parser.js", "public/js/jsl.interactions.js", "public/js/codemirror.js", "public/js/css/css.js", "public/js/xml/xml.js", "public/js/htmlmixed/htmlmixed.js", "public/js/javascript/javascript.js", "public/js/script.js"],
				}
			}
		},
		uglify: {
			my_target: {
				files: {
					"public/js/minified.js": ["public/js/concat.js"]
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					"public/css/minified.css": ["public/css/concat.css"]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};