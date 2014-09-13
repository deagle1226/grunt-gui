var timer = require('grunt-timer');
module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    timer.init(grunt, {
    	deferLogs: true
    });

  	grunt.initConfig({
    	'download-atom-shell': {
	    	version: '0.16.2',
		    outputDir: 'binaries',
		    downloadDir: 'tmp'
    	},
        shell: {
            run: {
                command: '.\\binaries\\atom.exe .'
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'nested'
                },
                files: [{
                    expand: true,
                    cwd: 'browser/sass',
                    src: ['**/*.scss'],
                    dest: 'browser/css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            sass: {
                files: ['browser/sass/**/*.scss'],
                tasks: ['sass:dev']
            }
        },
        concurrent: {
            dev: {
                tasks: ['shell:run', 'watch:sass'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
  	});

  	grunt.registerTask('dev', ['concurrent:dev']);

    grunt.registerTask('test', function() {
        console.log('test');
    });
};