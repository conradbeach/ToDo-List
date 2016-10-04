var loadGruntTasks = require('load-grunt-tasks');

function extractFilename(filePath) {
  return filePath.split('/')
                 .pop()
                 .match(/(.+)\.hbs/)
                 .pop();
}

function removeWhitespace(template) {
  return template.replace(/ {2,}/mg, '').replace(/\r|\n/mg, '');
}

module.exports = function Grunt(grunt) {
  var sources = ['public/javascripts/vendor/bower.js',
                 'public/javascripts/vendor/backbone.localStorage.js',
                 'public/javascripts/handlebars_templates.js',
                 'public/javascripts/app.js',
                 'public/javascripts/models/*.js',
                 'public/javascripts/collections/*.js',
                 'public/javascripts/views/*.js'];

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
          processName: extractFilename,
          processContent: removeWhitespace
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
      js: {
        files: ['public/javascripts/**/*.js',
                '!public/javascripts/app.min.js',
                '!public/javascripts/app.full.js',
                '!public/javascripts/handlebars_templates.js'],
        tasks: ['concat']
      },

      handlebars: {
        files: ['handlebars/*.hbs'],
        tasks: ['handlebars', 'concat']
      }
    }
  });

  loadGruntTasks(grunt);

  grunt.registerTask('default', ['bower_concat', 'handlebars', 'concat']);
};
