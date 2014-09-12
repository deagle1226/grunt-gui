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
    	}
  	});

  	grunt.registerTask('test', function() {
  		grunt.log.write('test ran');
  	});
};