var _ = require('underscore');
var remote = require('remote');
var spawn = remote.require('cross-spawn');

module.exports = (function(events) {
    var defaults = {
        verbose: false,
        force: false,
        gruntfile: false,
        noColor: true
    };

    var EVENT = {
        STDOUT: 'grunt-out',
        EXIT: 'grunt-exit',
        GET: 'grunt-get'
    };

    function getTasks(gruntfile) {
        gruntfile = gruntfile || false;
        var args = ['get-tasks'];
        if (gruntfile) args.push('--gruntfile ' + gruntfile);
        var thread = spawn('grunt', args, {stdio: 'pipe'});
        thread.stdout.on('data', function(data) {
            try {
                var tasks = JSON.parse(data.toString());
                events.emit(EVENT.GET, _.omit(tasks, 'get-tasks'));
            } catch(e) {
                return false;
            }
        });
    }

    function getTasksFromGrunt(grunt) {
        return grunt.task._tasks;
    }

    function run(task, options) {
        options = options || {};
        _.defaults(options, defaults);

        var args = [task];
        if (options.verbose) args.push('--verbose');
        if (options.force) args.push('--force');
        if (options.gruntfile) args.push('--gruntfile ' + options.gruntfile);
        if (options.noColor) args.push('--no-color');

        var thread = spawn('grunt', args, {stdio: 'pipe'});
        thread.on('exit', function() {
            events.emit(EVENT.EXIT, task, thread.pid, 'exit');
        });
        thread.stdout.on('data', function(data) {
            events.emit(EVENT.STDOUT, task, thread.pid, data.toString());
        });
        return thread.pid;
    }

    getTasks();
    return {
        EVENT: EVENT,
        run: run,
        get: getTasks
    };
});