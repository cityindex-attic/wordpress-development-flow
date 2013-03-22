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
        tasks: ['build']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('compile', 'Compile src/ into dist/', function() {
    shell.exec('wp core download --path=dist/');
    
    //fix for hiphop -> http://www.hiphop-php.com/wp/?p=113
    var replace = "define('OBJECT', 'OBJECT');\ndefine('Object', 'OBJECT');\ndefine('object', 'OBJECT');";
    shell.sed('-i', "define( 'OBJECT', 'OBJECT', true );", replace, 'dist/wp-includes/wp-db.php');
    
  });

  grunt.registerTask('dev-server', 'Serve site at http://localhost:4567' , function() {

      shell.rm('dist/wp-config.php');
      shell.exec('wp core config --dbname=wordpress --dbuser=root --dbpass=secret_password --path=dist/');

      shell.exec('mysqladmin -uroot -psecret_password create wordpress');

      var config = 
        "$whippet->options['wp-content'] = dirname(__FILE__) . '/wp-content';\n";
      shell.sed('-i', '/**#@-*/', config, 'dist/wp-config.php');

      shell.exec('whippet dist/ -i 0.0.0.0 -p 4567');
  });

  grunt.registerTask('release', 'Deploy to Stackato', function(deployName, username, password) {
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

  grunt.registerTask('build', ['jshint', 'clean', 'compile', 'copy']);
  grunt.registerTask('run', ['build', 'dev-server']);
 
  // Default task.
  grunt.registerTask('default', ['build'] );

};
