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

    -s, --sitemap [value]  Path to sitemap file, if specified grabber will grab all urls from the specified sitemap.
    -d, --domain [value]   Domain to grab, works in combination with paths option.
    -p, --phantom [value]  Path to phantom executable.
    -L, --log [value]      Path to log file, pass "none" to disable.
    -l, --paths <items>    List of paths specified with semicolon delimeter, works in combination with domain option.
    -o, --output [value]   Output directory
    -h, --help             output usage information    
```    

## Examples

### Grabbing list of urls
Following command will grab some instagram pages
```
html-grabber --domain https://www.instagram.com --paths /,/explore/,/explore/locations/
```

### Grabbing urls from sitemap
Following command will grab some instagram pages
```
html-grabber --sitemap tests/sitemap.xml
```

## License
HTML Grabber released with [MIT License](https://github.com/RomanLubushkin//blob/master/LICENSE)
