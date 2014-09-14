var $ = require('jquery');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();
var grunt = require('./grunt.js')(events);
var ipc = require('ipc');

(function() {

    var logs, menu;
    var gruntOptions = {};
    var processes = [];

    function init() {
        $(document).on('ready', function() {
            logs = $('#logs').find('ul');
            menu = $('core-menu');
            bindEvents();
        });
    }

    function bindEvents() {
        menu.on('click', 'paper-item', runGrunt);
        events.on(grunt.EVENT.STDOUT, log);
        events.on(grunt.EVENT.EXIT, log);
        $('[icon="refresh"]').on('click', function() {
            _.each(processes, function(pid) {
                process.kill(pid);
            });
            ipc.send('gg-refresh');
        });
        $('[icon="clear"]').on('click', function() {
            _.each(processes, function(pid) {
                process.kill(pid);
            });
            logs.empty();
        });
        $('[get-tasks]').on('click', function() {
            menu.empty();
            grunt.get();
        });
        events.on(grunt.EVENT.GET, function(tasks) {
            _.each(tasks, function(task, name) {
                menu.append('<paper-item title="' + task.info + 
                    '" label="' + name + 
                    '" gruntfile="' + task.meta.filepath + 
                    '" icon="radio-button-off"></paper-item>');
            });
        });
        $('[verbose]').on('change', function() {
            if(this.checked) gruntOptions.verbose = true;
            else gruntOptions.verbose = false;
        });
    }

    function log(task, pid, data) {
        if (data === 'exit') {
            console.log(pid + ': ' + task + ' exited');
            $('[label="' + task + '"]').attr('icon', 'radio-button-off');
            processes.splice(processes.indexOf(pid), 1);
        } else if (_.contains(processes, pid)) {
            logs.append('<li pid="' + pid + '" task="' + task + '">' + data + '</li>');
        }
    }

    function runGrunt() {
        if ($(this).attr('icon') === 'radio-button-off') {
            var task = $(this).attr('label');
            var gruntfile = $(this).attr('gruntfile');
            $(this).attr('icon', 'radio-button-on');
            var pid = grunt.run(task, gruntOptions);
            processes.push(pid);
        }
    }

    module.exports.init = init;
})();