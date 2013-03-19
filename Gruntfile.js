/*global module:false*/

var shell = require('shelljs'),
    path = require('path'),
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    folderMount = function folderMount(connect, point) {
      return connect['static'](path.resolve(point));
    };

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
                'dist/assets/stylesheets/docs-compiled.css': [
                    'src/assets/stylesheets/docs.less'
                ]
            }
        }
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['dist']
    },
    copy: {
      main: {
        files: [
          { 
            cwd: 'src/',         //base folder for src
            expand: true,
            src: [ 
              '**',          //everything
              '!**/*.less'   //except *.less
            ],
            dest: 'dist/'
          }        
        ]
      }
    },
    connect: {
      livereload: {
        options: {
          port: 4567,
          base: 'dist/',
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      }
    },
    // Watches for file changes, and trigger tasks
    regarde: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      watch_src: {
        files: 'src/**',
        tasks: ['default', 'livereload']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

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

  grunt.registerTask('build', ['jshint', 'clean', 'copy', 'recess']);
  grunt.registerTask('dev-server', ['build', 'livereload-start', 'connect', 'regarde']);
 
  // Default task.
  grunt.registerTask('default', ['build']);

};
