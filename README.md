# HTML Grabber
HTML Grabber - is a PhantomJS based console utility to grab HTML content from JavaScript based sites (single page application).
The only use case is to serve gotten HTML to old Web crawlers who can't work with the JavaScript-based site (Yandex, Yahoo, Bing, etc).

## Installation
To install HTML Grabber as global package run following command:

### Yarn  
```
yarn global add html-grabber
```

### npm  
```
npm install html-grabber -g
``` 

Note: It is assumed that PhantomJS already installed.

## Usage
```
html-grabber [options]

  Options:

    -t, --trigger [value]  Trigger type, possible values: console, event, auto, timeout.
    -T, --timeout [value]  Timeout value in ms for trigger type "timeout", default is 3000.
    -e, --event [value]    Event name for trigger types "event" and "console", default is "html-grabber-get-content"
    -s, --sitemap [value]  Path to sitemap file, if specified grabber will grab all urls from the specified sitemap.
    -d, --domain [value]   Domain to grab, works in combination with paths option.
    -p, --phantom [value]  Path to phantom executable.
    -L, --log [value]      Path to log file, pass "none" to disable.
    -l, --paths <items>    List of paths specified with semicolon delimeter, works in combination with domain option.
    -o, --output [value]   Output directory
    -h, --help             output usage information
```    

## Examples
This pages provide information for testing grabber functionality.
* https://romanlubushkin.github.io/html-grabber/tests/pages/auto.html
* https://romanlubushkin.github.io/html-grabber/tests/pages/console.html
* https://romanlubushkin.github.io/html-grabber/tests/pages/event.html
* https://romanlubushkin.github.io/html-grabber/tests/pages/timeout.html

## License
HTML Grabber released with [MIT License](https://github.com/RomanLubushkin//blob/master/LICENSE)
