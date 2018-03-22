module.exports = function(grunt) {
  // Do grunt-related things in here
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),
  	jshint: {
  		files: ['*.js', 'routes/*.js', 'public/js/ajax.js'],
  		options: {
  			//jQuery: true
  		}
  	},
    uglify: {
      my_target: {
        files: {
          'public/js/ajax.min.js': ['public/js/ajax.min.js']
        }
      }
    },
    concat: {
      dist: {
        src: ['public/css/materialize.css', 'public/css/style.css'],
        dest: 'public/css/build.css'
      }
    },
    cssmin: {
      minify: {
        src: 'public/css/build.css',
        dest: 'public/css/build.min.css'
      }
    },
  	/*compass: {
  		dist: {
  			options: {
  				sassDir: 'public/sass',
  				cssDir: 'public/css'
  			}
  		}
  	},
    Support deprecated, removed from watch: css: tasks
    */
  	watch: {
  		css: {
	  		files: ['public/css/*.css', 'public/sass/*.scss'],
	  		tasks: ['concat', 'cssmin']
	  	},
	  	scripts: {
	  		files: ['*.js', 'routes/*.js', 'public/js/*.js'],
	  		tasks: ['jshint', 'uglify']
	  	},
      minifyJS: {
        files: ['public/js/ajax.js'],
        tasks: ['uglify']
      }
  	}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['watch']); //make them run automatically when you run "grunt default"
};
