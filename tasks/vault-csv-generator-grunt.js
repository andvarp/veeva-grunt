module.exports = function(grunt) {

    function main() {
        var done = this.async();
        var fs = require('fs');
        var async = require('async');

        grunt.verbose.writeln("task: " + this.task + ", target: " + this.target);

        // Iterate over each item in the "files" array in the vaultCsvGenerator object in the gruntfile config
        async.eachSeries(this.data, function(file, filesCallback) {
            var envData = file.envData;
            var vaultIdRoot = envData.vaultIdRoot;
            var slideMap = envData.slideMap;
            var csvValues = envData.csvValues;
            var csvFile = fs.createWriteStream(file.csvFileName);
            var stream = require('stream');
            var Readable = stream.Readable;
            var csvDataRs = Readable();

            // define _read() for the csv readable stream object. This will get called when someone calls read() or pipe() on it
            // Read https://github.com/substack/stream-handbook if you don't understand how the steam code works :)
            csvDataRs._read = function() {
                var csvKeys = Object.keys(csvValues);
                var headerRow = [];

                // write the header row
                for (var x = 0; x < csvKeys.length; x++) {
                    headerRow.push('"' + csvKeys[x] + '"');
                }

                csvDataRs.push(headerRow.toString() + "\n");

                // write a row for each slide defined in slideMap
                var slideMapKeys = Object.keys(slideMap);

                for (var i = 0; i < slideMapKeys.length; i++) {
                    var slideKey = slideMapKeys[i];
                    var slide = slideMap[slideKey];
                    var row = [];
                    //
                    if (!slide.hasOwnProperty('csv')){
                      for (var x = 0; x < csvKeys.length; x++) {
                          var key = csvKeys[x];
                          var value = csvValues[key];
                          var field = '';

                          if (value !== '') { // if there's a default value, use it
                              field = value;
                          } else {
                              // get the slide specific data and format it based on which column we're processing
                              switch (key) {
                                  case 'document_id__v':
                                      field = slide.km;
                                      break;
                                  case 'external_id__v':
                                      field = vaultIdRoot + slide.km;
                                      break;
                                  case 'name__v':
                                      field = slide.name;
                                      break;
                                  case 'Presentation Link':
                                      field = slide.pres;
                                      break;
                                  case 'slide.filename':
                                      field = slide.name + '.zip';
                                      break;
                              }
                          }

                          // add the quoted field to the row
                          row.push('"' + field + '"');
                      }

                      csvDataRs.push(row.toString() + "\n");
                  }
                  //
                }

                csvDataRs.push(null);
            }

            var csvStream = csvDataRs.pipe(csvFile);
            csvStream.on('finish', function() {
                filesCallback();
            });
        }, function(err) { // end of async.eachSeries() iterator on the files
            if (err)
                throw err;

            done();
        });
    }

    return main;
};