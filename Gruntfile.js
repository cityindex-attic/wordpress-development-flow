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
      }
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
    // Watches for file changes, and trigger tasks
    regarde: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      watch_src: {
        files: 'src/**',
        events: true
      }
    }
  });

  //TODO - this doesn't seem to detect added or deleted events.
  grunt.event.on('regarde:watch_src:file', function (status, file) {
    var dist_file = file.replace('src','dist'); 
    grunt.log.writeln(file + ' has ' + status + ' -> copying to ' + dist_file);

    grunt.file.copy(file, dist_file);
    shell.exec('touch '+ dist_file); //Ensures hiphop will notice the change and recompile
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('refresh-buildpack', 'Download buildpack to ./buildpack' , function() {
    if (shell.test('-d', "/home/vagrant/buildpack/.git")) { 
      grunt.log.writeln('Updating buildpack');
      shell.exec('git --git-dir ./buildpack/.git pull');
    } else {
      grunt.log.writeln('Cloning buildpack');
      shell.exec('git clone git://github.com/mrdavidlaing/stackato-buildpack-wordpress.git ./buildpack');
    }
  });

  grunt.registerTask('docs', 'Generating wordpress documentation', function(){
    //pass
  });

  grunt.registerTask('compile', ['copy','refresh-buildpack', 'compile-buildpack']);
  grunt.registerTask('compile-buildpack', 'Compile dist/ using buildpack/bin/compile', function() {
    shell.exec('./buildpack/bin/compile ./dist ./.buildpack-cache');    
  });

  grunt.registerTask('setup-test-database', 'Create a test database with some test data' , function() {
      shell.exec("mysql -uroot -psecret_password -e 'CREATE DATABASE IF NOT EXISTS wordpress'");
      shell.exec("cat tests/wordpress.sample.sql | mysql -uroot -psecret_password wordpress");
      grunt.log.ok('Setup test database'); 
  });

  grunt.registerTask('dev-server', 'Serve site at http://localhost:4567' , function() {
      shell.exec('cd dist/ && bin/start.sh 4567 Verbose', {async:true});
  });

  grunt.registerTask('release', 'Deploy to Stackato', function(deployName, username, password) {
    var stackatoBaseUri = "stackato.cil.stack.me";

    if (deployName === undefined) {
      grunt.log.error('You must pass a deployName -> grunt release:your-deploy-name:username:password');
      return false;
    } 
    if (username === undefined) {
      grunt.log.error('You must pass a username -> grunt release:your-deploy-name:username:password');
      return false;
    } 
    if (password === undefined) {
      grunt.log.error('You must pass a password -> grunt release:your-deploy-name:username:password');
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
    if (shell.exec('stackato push '+ deployName + ' --no-prompt --path ./dist').code !== 0) {
      shell.exec('stackato update '+ deployName + ' --no-prompt --path ./dist');
    }

    grunt.log.ok('Deployment successful'); 

  });

  grunt.registerTask('verify-hosting-dependancies', 'Ensure that all the hosting dependancies are in place to serve up WordPress' , function() {
      if (!shell.which('mysql')) {
        grunt.log.error('mysql must be installed');
        return false;
      }
      grunt.log.ok("All hosting dependancies look good!");
  });

  grunt.registerTask('build', ['jshint', 'compile']);
  grunt.registerTask('rebuild', ['clean', 'build']);
  grunt.registerTask('run', ['build', 'verify-hosting-dependancies', 'setup-test-database', 'dev-server', 'regarde']);
 
  // Default task.
  grunt.registerTask('default', ['build'] );

};
