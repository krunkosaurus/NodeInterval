#!/usr/local/bin/node
var Nodeinterval = require('nodeinterval'),
ni = new Nodeinterval.Watcher({
    watchFolder: '../src/templates/',
    inputFile: '../src/html/index.html',
    replacementString: '@templates@',
    outputFile: '../assets/index.html'
}).startWatch();