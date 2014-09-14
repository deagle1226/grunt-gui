var _ = require('underscore');
var remote = require('remote');
var spawn = remote.require('cross-spawn');

module.exports = function(events) {
    var defaults = {
        verbose: false,
        force: false,
        gruntfile: false,
        noColor: true
    };

    var EVENT = {
        STDOUT: 'grunt-out'
    };

    function run(task, options) {
        options = options || {};
        _.defaults(options, defaults);

        var args = [task];
        if (options.verbose) args.push('--verbose');
        if (options.force) args.push('--force');
        if (options.gruntfile) args.push('--gruntfile ' + options.gruntfile);
        if (options.noColor) args.push('--no-color');

        spawn('grunt', args, {stdio: 'pipe'}).stdout.on('data', function(data) {
            events.emit(EVENT.STDOUT, data.toString());
        });
    }

    return {
        test: function() { run('test'); },
        sass: function() { run('sass', {verbose: true}); },
        jshint: function() { run('jshint'); },
        EVENT: EVENT
    };
};