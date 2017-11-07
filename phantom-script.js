var webpage = require('webpage');
var fs = require('fs');
var args = require('system').args;
var configPath = args[1];
var logPath = args[2];
var inputs = JSON.parse(fs.read(configPath));
var inputsCount = inputs.length;

var pagesMap = {};
var complete = 0;
var pagesLimit = 2;

log('Start grabbing ' + inputs.length + ' urls');
for (var i = 0, count = Math.min(inputs.length, pagesLimit); i < count; i++) {
    grabNextOrExit();
}

function log(msg) {
    fs.write(logPath, '[' + new Date().toString() + '] ' + msg, "a");
}

function grabNextOrExit() {
    if (inputs.length) {
        grabPage(inputs.shift());
    } else if (complete === inputsCount) {
        var success = 0;
        var failed = 0;
        for (var key in pagesMap) {
            var row = pagesMap[key];
            if (row.status === 'success' && row.resultTime !== undefined) {
                success++
            } else {
                failed++;
            }
        }
        console.log('Grabbing complete');
        console.log('Successful: ' + success);
        console.log('Failed: ' + failed);
        console.log('Full log at : ' + logPath);
        phantom.exit();
    }
}

function grabPage(input) {
    var url = input.url;
    var uuid = input.uuid;
    var startTime = new Date().getTime();

    log('Page: ' + url + ' - start\n');
    var page = webpage.create();
    page.open(url, function (status) {
        log('Page: ' + url + ' - ' + status + '\n');
        var loadTime = new Date().getTime() - startTime;
        pagesMap[uuid] = {page: page, url: url, startTime: startTime, loadTime: loadTime, status: status, output: input.output};
        if (status === 'success') {
            page.onConsoleMessage = onConsoleMessage;
            page.evaluateAsync(function (msg) {
                console.log(msg);
            }, 2000, uuid);
        } else {
            complete++;
        }
    });
}

function onConsoleMessage(uuid) {
    var data = pagesMap[uuid];
    if (data) {
        log('Page: ' + data.url + ' - got content\n');
        complete++;
        data.resultTime = new Date().getTime() - data.startTime;
        var content = data.page.evaluate(function () {
            return document.documentElement.outerHTML;
        });
        fs.write(data.output, content, 'w');
        data.page.close();
        data.page = null;
        grabNextOrExit();
    }
}

