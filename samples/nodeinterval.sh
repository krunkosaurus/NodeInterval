#!/usr/local/bin/node
var NodeInterval = require('nodeinterval'),
ni = new NodeInterval.Watcher({
    watchFolder: '../src/templates/',
    inputFile: '../src/html/index.html',
    replacementString: '@templates@',
    outputFile: '../assets/index.html'
}).startWatch();