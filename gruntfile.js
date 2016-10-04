function extractFilename(filePath) {
  return filePath.split('/').pop().match(/(.+)\.hbs/).pop();
}

module.exports = function Grunt(grunt) {
  var sources = ['public/javascripts/vendor/bower.js',
                 'public/javascripts/vendor/backbone.localStorage.js',
                 'public/javascripts/app.js',
                 'public/javascripts/models/*.js',
                 'public/javascripts/collections/*.js',
                 'public/javascripts/views/*.js']

  grunt.initConfig({
    bower_concat: {
      all: {
        dest: {
          js: 'public/javascripts/vendor/bower.js'
        },
        dependencies: {
          underscore: 'jquery',
          backbone: 'underscore'
        }
      }
    },

    concat: {
      basic: {
        src: sources,
        dest: 'public/javascripts/app.full.js'
      }
    },

    handlebars: {
      all: {
        files: {
          'public/javascripts/handlebars_templates.js': 'handlebars/**/*.hbs'
        },
        options: {
          processName: extractFilename
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/javascripts/app.min.js': sources
        }
      }
    },

    watch: {
      files: ['public/javascripts/**/*.js',
              '!public/javascripts/app.min.js',
              '!public/javascripts/app.full.js',
              'handlebars/*.hbs'],
      tasks: ['concat', 'handlebars']
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bower_concat', 'concat', 'handlebars']);
};
