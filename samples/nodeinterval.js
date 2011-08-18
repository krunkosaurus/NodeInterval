var Nodeinterval = require('nodeinterval');
var nodeinterval = new Nodeinterval({
    watchFolder: '../src/html/templates/',
    inputFile: '../src/html/index.html',
    replacementString: '@templates@',
    outputFile: '../assets/index.html'
});