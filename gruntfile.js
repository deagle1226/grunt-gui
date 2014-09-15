var timer = require('grunt-timer');
module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
        availabletasks: 'grunt-available-tasks'
    });
    timer.init(grunt, {
    	deferLogs: true
    });

  	grunt.initConfig({
        dir: {
            dist: {
                mac: 'binaries/Atom.app/Contents/Resources/app',
                win: 'binaries/resources/app'
            },
            atom: {
                mac: './binaries/Atom.app/Contents/MacOS/Atom',
                win: '.\\binaries\\atom.exe'
            }
        },
        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: ['availabletasks', 'get-tasks'],
                    groups: {
                        'Build Distributables': ['build-mac', 'build-win'],
                        'Development': ['dev-mac', 'dev-win', 'grunt-sass'],
                        'Testing': ['grunt-jshint']
                    }
                }
            }
        },
    	'download-atom-shell': {
	    	version: '0.16.2',
		    outputDir: 'binaries',
		    downloadDir: 'tmp'
    	},
        shell: {
            win: {
                command: '<%= dir.atom.win %> .'
            },
            mac: {
                command: '<%= dir.atom.mac %> .'
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
        jshint: {
            app: ['app/**/*.js'],
            browser: ['browser/js/**/*.js'],
            options: {
                reporter: require('jshint-stylish')
            }
        },
        watch: {
            sass: {
                files: ['browser/sass/**/*.scss'],
                tasks: ['sass:dev']
            },
            swig: {
                files: ['browser/swig/**/*.swig'],
                tasks: ['swig']
            }
        },
        concurrent: {
            'dev-mac': {
                tasks: ['shell:mac', 'watch:sass', 'watch:swig'],
                options: {
                    logConcurrentOutput: true
                }
            },
            'dev-win': {
                tasks: ['shell:win', 'watch:sass', 'watch:swig'],
                options: {
                    logConcurrentOutput: true
                }
            },
            build: {
                tasks: ['jshint', 'sass', 'swig'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        copy: {
            mac: {
                files: [
                    {
                        expand: true,
                        src: [
                            'browser/**',
                            'app/**',
                            'node_modules/**',
                            'package.json',
                            'gruntfile.js'
                        ],
                        dest: '<%= dir.dist.mac %>'
                    },
                ]
            },
            win: {
                files: [
                    {
                        expand: true,
                        src: [
                            'browser/**',
                            'app/**',
                            'node_modules/**',
                            'package.json',
                            'gruntfile.js'
                        ],
                        dest: '<%= dir.dist.win %>'
                    },
                ]
            }
        },
        clean: {
            mac: ['<%= dir.dist.mac %>'],
            win: ['<%= dir.dist.win %>']
        },
        swig: {
            dev: {
                init: {
                    root: 'browser/swig/',
                    allowErrors: false,
                    autoescape: true
                },
                dest: 'browser/html/',
                cwd: 'browser/swig/',
                src: ['index.swig']
            }
        }
  	});
    grunt.loadTasks('tasks');

  	grunt.registerTask('dev-mac',
        'Run debug app and development tasks (like sass) on Mac OS X',
        ['clean:mac', 'concurrent:dev-mac']);
    grunt.registerTask('dev-win',
        'Run debug app and development tasks (like sass) on Windows',
        ['clean:win', 'concurrent:dev-win']);
    grunt.registerTask('build-mac',
        'Build distributable Atom.app for Mac OS X',
        ['concurrent:build', 'clean:mac', 'copy:mac']);
    grunt.registerTask('build-win',
        'Build distributable atom.exe for Windows',
        ['concurrent:build', 'clean:win', 'copy:win']);

    grunt.registerTask('grunt-sass',
        'Compile *.scss into *.css',
        ['sass:dev']);
    grunt.registerTask('grunt-jshint',
        'Run JSHint on all javascript files',
        ['jshint']);

    grunt.registerTask('get-tasks', 'Helper for grunt-gui to get task data', function() {
        var tasks = JSON.stringify(grunt.task._tasks);
        grunt.log.writeln(tasks);
    });
};