#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid/v4');
var shell = require('shelljs');
var tmp = require('tmp');
var cheerio = require('cheerio');
var url = require('url');
var child_process = require('child_process');

program
    .usage('[options]')
    .option('-s, --sitemap [value]', 'Path to sitemap file, if specified grabber will grab all urls from the specified sitemap.')
    .option('-d, --domain [value]', 'Domain to grab, works in combination with paths option.')
    .option('-p, --phantom [value]', 'Path to phantom executable.', 'phantomjs')
    .option('-L, --log [value]', 'Path to log file, pass "none" to disable.', 'grabber.log')
    .option('-l, --paths <items>', 'List of paths specified with semicolon delimeter, ' +
        'works in combination with domain option.', list)
    .option('-o, --output [value]', 'Output directory', 'output')
    .parse(process.argv);

if (!(program['paths'] && program['domain']) && !program['sitemap']) {
    console.log('You have to specify domain with paths or sitemap');
    process.exit(1);
}

function list() {
    return val.split(',');
}


function hrefToOutput(href) {
    return path.join(path.resolve(program['output']), href.endsWith('/') ? href + 'index.html' : href);
}


function parseUrlsList() {
    return program['paths'].map(function (row) {
        var output = hrefToOutput(row);
        shell.mkdir('-p', path.dirname(output));

        return {
            url: program['domain'] + row,
            uuid: uuid(),
            output: output
        }
    });
}


function parseSiteMap() {
    var contents = fs.readFileSync(path.resolve(__dirname, program['sitemap']), 'utf8');
    var xml = cheerio.load(contents);
    var result = [];

    xml('loc').each(function (index, element) {
        var sitemapUrl = element.children[0].data;
        var href = url.parse(sitemapUrl).pathname;
        var output = hrefToOutput(href);
        shell.mkdir('-p', path.dirname(output));
        result.push({
            url: sitemapUrl,
            uuid: uuid(),
            output: output
        });
    });

    return result;
}

var output = path.resolve(__dirname, program['output']);
var urls = program['paths'] ? parseUrlsList() : parseSiteMap();
var tmpobj = tmp.fileSync();
var logPath = path.resolve(program['log']);
var command = program['phantom'] + ' ' +
    path.resolve(__dirname, 'phantom-script.js') + ' ' +
    tmpobj.name + ' ' +
    logPath;

shell.mkdir('-p', path.dirname(logPath));
fs.writeFileSync(tmpobj.name, JSON.stringify(urls));
child_process.exec(command, function (error, stdout, stderr) {
    if (error || stderr) {
        console.log(error || stderr);
        process.exit(1);
    }
    console.log(stdout);
    tmpobj.removeCallback();
});


