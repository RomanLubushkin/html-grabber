#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var command = 'node index.js --output tests/cmd_output --paths /,/explore/,/explore/locations/ --domain https://www.instagram.com';

child_process.execSync(command, function (error, stdout, stderr) {
    if (error || stderr) {
        console.log(error || stderr);
        process.exit(1);
    }
    console.log(stdout);
});

var dir = path.resolve(__dirname);
if (
    fs.existsSync(path.join(dir, 'cmd_output', 'index.html')) &&
    fs.existsSync(path.join(dir, 'cmd_output', 'explore', 'index.html')) &&
    fs.existsSync(path.join(dir, 'cmd_output', 'explore', 'locations', 'index.html'))
) {
    console.log('Cmd test passed');
} else {
    console.log('Cmd test failed');
    process.exit(1);
}



