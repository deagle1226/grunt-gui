module.exports = function(grunt) {

  var fs = require('fs'),
      swig = require('swig');

  grunt.registerMultiTask('swig', 'swig templater', function(context) {
    var config = this,
        file_re = /(.*)\.([A-Za-z]+)/i,
        pages = [],
        d = new Date();
        d = d.toISOString();
    context = context || '';

    config.filesSrc.forEach(function(filename) {

      var file = file_re.exec(filename)[1],
          template = swig.compileFile(config.data.init.root + filename),
          destFile = config.data.dest + file,
          templateVars = {},
          contextVars = {},
          globalVars = {};

          destFile.replace(/\.[^/.]+$/, "");
          destFile += '.html';

      try {
        var globalIncVars = grunt.file.readJSON(config.data.init.root + "global.json");
        globalVars = grunt.util._.extend(config.data, globalIncVars);
      } catch (err) {
        globalVars = grunt.util._.clone(config.data);
      }

      try {
        templateVars = grunt.file.readJSON(config.data.init.root + file + ".json");
      } catch(err) {
        templateVars = {};
      }

      templateVars.context = context;

      grunt.log.writeln('Writing file to ' + destFile);

      grunt.file.write(destFile, template(grunt.util._.extend(globalVars, templateVars, contextVars)));

    });

  });
};
