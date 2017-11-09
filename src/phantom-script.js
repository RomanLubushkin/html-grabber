var webpage = require('webpage');
var fs = require('fs');
var args = require('system').args;

try {
  var configPath = args[1];
  var grabbingMode = args[2];
  var grabbingTimeout = args[3];
  var eventNameOrConsoleMsg = args[4];
  var logPath = args[5];
  var inputs = JSON.parse(fs.read(configPath));
  var inputsCount = inputs.length;

  var success = 0;
  var failed = 0;
  var pagesLimit = 2;

  for (var i = 0, count = Math.min(inputs.length, pagesLimit); i < count; i++) {
    grabNextOrExit();
  }

  function log(msg) {
    if (logPath !== 'none') {
      fs.write(logPath, '[' + new Date().toString() + '] ' + msg, "a");
    }
  }


  function grabNextOrExit() {
    if (inputs.length) {
      grabPage(inputs.shift());
    } else if ((success + failed) === inputsCount) {
      console.log('Complete');
      console.log('successful - ' + success + ', failed - ' + failed);
      phantom.exit();
    }
  }


  function getContent(pageData, action) {
    log('Page: ' + pageData.url + ' - got content on ' + action + '\n');
    success++;
    pageData.resultTime = new Date().getTime() - pageData.startTime;
    var content = pageData.page.evaluate(function() {
      return document.documentElement.outerHTML;
    });
    fs.write(pageData.output, content, 'w');
    pageData.page.close();
    pageData.page = null;
    grabNextOrExit();
  }


  function grabPage(input) {
    var url = input.url;
    var startTime = new Date().getTime();

    log('Page: ' + url + ' - start\n');
    var page = webpage.create();
    var pageData = {page: page, url: url, startTime: startTime, output: input.output, activeRequests: []};
    var onSuccessHandler = null;

    if (grabbingMode === 'auto') {
      page.onResourceReceived = autoTrigger_onResourceReceived.bind(undefined, pageData);
      page.onResourceRequested = autoTrigger_onResourceRequested.bind(undefined, pageData);
      onSuccessHandler = autoTrigger_getContent.bind(undefined, pageData, 'page loaded');
    } else if (grabbingMode === 'timeout') {
      onSuccessHandler = timeoutTrigger_successHandler.bind(undefined, pageData);
    } else if (grabbingMode === 'console') {
      page.onConsoleMessage = consoleTrigger_onConsoleMessage.bind(undefined, pageData);
    } else if (grabbingMode === 'event') {
      page.onConsoleMessage = eventTrigger_onConsoleMessage.bind(undefined, pageData);
      onSuccessHandler = function() {
        page.evaluate(eventTrigger_addEventListener, eventNameOrConsoleMsg)
      };
    }

    page.open(url, function(status) {
      log('Page: ' + url + ' - ' + status + '\n');
      pageData['loadTime'] = new Date().getTime() - startTime;
      pageData['status'] = status;

      if (status === 'success') {
        if (onSuccessHandler) onSuccessHandler();
      } else {
        failed++;
      }
    });
  }


// region ---- grabbing mode console
  function consoleTrigger_onConsoleMessage(pageData, msg) {
    if (msg === eventNameOrConsoleMsg) {
      getContent(pageData, 'console message');
    }
  }

// endregion


// region ---- grabbing mode event
  function eventTrigger_onConsoleMessage(pageData, msg) {
    if (msg === 'html-grabber-get-content') {
      getContent(pageData, 'event');
    }
  }

  function eventTrigger_addEventListener(eventName) {
    document.addEventListener(eventName, function() {
      console.log('html-grabber-get-content');
    }, false);
  }

// endregion


// region ---- grabbing mode timeout
  function timeoutTrigger_successHandler(pageData) {
    setTimeout(function() {
      getContent(pageData, 'timeout');
    }, grabbingTimeout);
  }

// endregion


// region ---- grabbing mode auto
  function autoTrigger_onResourceReceived(pageData, e) {
    pageData.activeRequests.splice(pageData.activeRequests.indexOf(e.id), 1);
    autoTrigger_getContent(pageData, 'resources loaded');

  }

  function autoTrigger_onResourceRequested(pageData, e) {
    pageData.activeRequests.push(e.id);
  }

  function autoTrigger_getContent(pageData, action) {
    if (pageData.activeRequests.length === 0 && pageData.loadTime !== undefined) {
      getContent(pageData, action);
    }
  }
} catch (e) {
  console.log(e);
  phantom.exit(1);
}

// endregion

