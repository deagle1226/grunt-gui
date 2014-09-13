var $ = require('jquery');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();
var grunt = require('./grunt.js')(events);
var ipc = require('ipc');

(function() {

    var logs;

    function init() {
        logs = $('#logs').find('ul');
        bindEvents();
    }

    function bindEvents() {
        $('#test').on('click', grunt.test);
        $('#sass').on('click', grunt.sass);
        events.on('grunt-out', log);
        $('#refresh').on('click', function() {
            ipc.send('gg-refresh');
        });
    }

    function log(data) {
        logs.append('<li>' + data + '</li>');
    }

    module.exports.init = init;
})();