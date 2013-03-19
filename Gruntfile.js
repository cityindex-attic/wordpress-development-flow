/*global module:false*/

var shell = require('shelljs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true,
          require: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    recess: {
        dist: {
            options: {
                compile: true
            },
            files: {
                'assets/stylesheets/docs-compiled.css': [
                    'assets/stylesheets/less/docs.less'
                ]
            }
        }
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('deploy', 'Deploy to Stackato', function(deployName, username, password) {
    var stackatoBaseUri = "stackato.cil.stack.me";

    if (deployName === undefined) {
      grunt.log.error('You must pass a deployName -> grunt deploy:your-deploy-name:username:password');
      return false;
    } 
    if (username === undefined) {
      grunt.log.error('You must pass a username -> grunt deploy:your-deploy-name:username:password');
      return false;
    } 
    if (password === undefined) {
      grunt.log.error('You must pass a password -> grunt deploy:your-deploy-name:username:password');
      return false;
    } 
    if (!shell.which('stackato')) {
      grunt.log.error('stackato must be in your path');
      return false;
    }
    grunt.log.writeln('deploying to url: http://' + deployName + '.' + stackatoBaseUri );
    shell.exec('stackato target https://api.' + stackatoBaseUri);
    shell.exec('stackato login ' + username + ' --pass ' + password);

    //Push or update
    if (shell.exec('stackato push '+ deployName + ' --no-prompt').code !== 0) {
      shell.exec('stackato update '+ deployName + ' --no-prompt');
    }

    grunt.log.ok('Deployment successful'); 

  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'recess']);

};
