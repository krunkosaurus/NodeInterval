var fs = require('fs'),
  _ = require('underscore'),
  watch = require('nodewatch'),
  log = require('simple-logger');

function NodeInterval(options){
    var that = this;
    _(this).extend(options);

    _.each(this.getFilesFrom(this.watchFolder), function(file){
        watch.add(file);
    });

    // Start the watch change listener.
    watch.onChange(function(file, prevTime, currTime){
        log.info('>>> Change detected to:', file);
        that.updateIndex();
    });

    // Render files on start.
    log.log_level = 'info';
    log.info('NodeInterval is watching for changes. Press Ctrl-C to stop.');
    this.updateIndex();
};

NodeInterval.prototype = {
    // Recursively return an array of all files in a directory.
    getFilesFrom: function(dir){
        var filesAr = [];
        var recurse;

        // Normalize path.
        if (dir[dir.length-1] !== '/'){
            dir = dir + '/';
        }

        recurse = function(dir){
            var arr = fs.readdirSync(dir);
            if (arr.length){
                _.each(arr, function(fileOrDir){
                    if (fileOrDir[0] !== '.'){

                        if (fs.lstatSync(dir + fileOrDir).isDirectory()){
                            recurse(dir + fileOrDir + '/');
                        }else{
                            filesAr.push(dir + fileOrDir);
                        }
                    }
                });
            }
        }
        recurse(dir);
        return filesAr;
    },

    // Get the text contents of a file.
    getFileContents: function(file){
        return fs.readFileSync(file, 'utf8');
    },

    // Concat an array of files together into a single string.
    stringFromFiles: function(filesAr){
        var that = this;
        var str = '';
        _.each(filesAr, function(file){
            str += that.getFileContents(file);
        });
        return str;
    },

    // Write a string to a file.
    writeToFile: function(file, str){
        log.info('overwrite', file);
        fs.writeFileSync(file, str, 'utf8');
    },

    // Update target page with new templates.
    updateIndex: function(){
        var date = new Date();
        var filesAr = this.getFilesFrom(this.watchFolder);
        var content = this.stringFromFiles(filesAr);
        var template = this.getFileContents(this.inputFile);
        template = template.replace(this.replacementString, content);
        this.writeToFile(this.outputFile, template);
        log.info('Completed in ' + ((new Date() - date) / 1000) + ' seconds.');
    }

}

module.exports = NodeInterval;