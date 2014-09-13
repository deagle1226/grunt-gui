var _ = require('underscore');
var remote = require('remote');
var spawn = remote.require('cross-spawn');

module.exports = function(events) {
    var defaults = {
        verbose: false,
        force: false,
        gruntfile: '',
        noColor: true
    };

    function run(task, options) {
        options = options || {};
        _.defaults(options, defaults);

        var args = [task];

        if (options.verbose) args.push('--verbose');
        if (options.force) args.push('--force');
        if (options.gruntfile.length > 1) args.push('--gruntfile ' + options.gruntfile);
        if (options.noColor) args.push('--no-color');

        spawn('grunt', args).stdout.on('data', function(data) {
            events.emit('grunt-out', data.toString());
        });
    }

    return {
        test: function() { run('test') },
        sass: function() { run('sass', {verbose: true}) }
    };
};