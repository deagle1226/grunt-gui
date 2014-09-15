var $ = require('jquery');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var grunt = require('./grunt.js')(emitter);
var pager = require('./pager.js');
var ipc = require('ipc');
var fs = require('fs');
var swig = require('swig');

(function() {

    var panel, logs, menu, gruntfile,
        packageJson, gruntOptions,
        processes, animations,
        gruntTasks;

    function init() {
        gruntOptions = {};
        processes = [];
        animations = {};
        $(document).on('ready', function() {
            panel = {
                logs: $('#logs'),
                settings: $('#settings')
            };
            logs = panel.logs.find('section').find('ul');
            menu = $('core-menu');
            pager.init(panel.logs);
            bindEvents();

            CoreStyle.g.paperInput.focusedColor = '#E78724';
        });
    }

    function bindEvents() {
        menu.on('click', 'paper-item', events.runGrunt);
        $('[icon="refresh"]').on('click', events.refresh);
        $('[icon="clear"]').on('click',events.killAll);
        $('[get-tasks]').on('click', events.getTasks);
        $('[icon="menu"]').on('click', events.toggleDrawer);
        $('[verbose]').on('change', events.toggleVerbose);
        $('paper-input#gruntfile').on('change', events.input.gruntfile);

        $('[icon="arrow-back"]').on('click', pager.back);
        $('[icon="settings"]').on('click', {page: panel.settings}, pager.go);

        emitter.on(grunt.EVENT.STDOUT, events.log);
        emitter.on(grunt.EVENT.EXIT, events.log);
        emitter.on(grunt.EVENT.GET, events.gruntGet);
    }

    var events = {
        refresh: function(event) {
            _.each(processes, function(pid) {
                process.kill(pid);
                animations[pid].cancel();
            });
            ipc.send('gg-refresh');
        },
        killAll: function(event) {
            _.each(processes, function(pid) {
                process.kill(pid);
                animations[pid].cancel();
            });
            logs.empty();
        },
        getTasks: function(event) {
            menu.find('paper-item').remove();
            grunt.get(gruntfile);
        },
        toggleDrawer: function(event) {
            $('core-drawer-panel')[0].togglePanel();
        },
        gruntGet: function(tasks) {
            gruntTasks = [];
            _.each(tasks, function(task, name) {
                gruntTasks.push({
                    name: name,
                    description: task.info,
                    gruntfile: task.meta.filepath
                });
            });
            menu.html(swig.renderFile('browser/swig/task-menu.swig', {tasks: gruntTasks}));
        },
        toggleVerbose: function(event) {
            if(this.checked) gruntOptions.verbose = true;
            else gruntOptions.verbose = false;
        },
        log: function(task, pid, data) {
            if (data === 'exit') {
                console.log(pid + ': ' + task + ' exited');
                $('[label="' + task + '"]').attr('icon', 'radio-button-off').removeClass('active');
                processes.splice(processes.indexOf(pid), 1);
                animations[pid].cancel();
            } else {
                logs.append('<li pid="' + pid + '" task="' + task + '">' + data + '</li>');
            }
        },
        runGrunt:function(event) {
            if ($(this).attr('icon') === 'radio-button-off') {
                var task = $(this).attr('label');
                var gruntfile = $(this).attr('gruntfile');
                $(this).attr('icon', 'radio-button-on').addClass('active');
                var pid = grunt.run(task, gruntOptions);
                processes.push(pid);
                var animation = new CoreAnimation();
                animation.duration = 1000;
                animation.iterations = 'Infinity';
                animation.keyframes = [
                    {transform: 'scale3d(1, 1, 1)'},
                    {transform: 'scale3d(1.05, 1.05, 1.05)'},
                    {transform: 'scale3d(1, 1, 1)'}
                ];
                animation.target = $(this.shadowRoot)[0].children[1];
                animation.play();
                animations[pid] = animation;
            }
        },
        input: {
            gruntfile: function(event) {
                gruntfile = $(this).val();
                console.log(gruntfile);
                fs.exists(gruntfile, function(exists) {
                    if (exists) {
                        menu.find('paper-item').remove();
                        grunt.get(gruntfile);
                        packageJson = fs.readFile(gruntfile.replace(/gruntfile.js/ig, 'package.json'), function (err, data) {
                            packageJson = JSON.parse(data);
                            console.log(packageJson);
                            menu.find('h4').text(packageJson.name + '@' + packageJson.version);
                        });

                    }
                });
            }
        }
    };

    module.exports.init = init;
})();