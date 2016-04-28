# Timepicker
Simple timepicker directive for AngularJS

## Usage

```HTML
<div my-timepicker format="HH : mm" value="timeValue" min-time="minTime" max-time="maxTime"></div>
```
### Parameters
`format`
- `HH` hours (24-hour clock)
- `hh` hours (12-hour clock)
- `mm` minutes
- `ss` seconds

`value` a Date object

`min-time` a Date object

`max-time` a Date object

## Demo

http://mean-stack.github.io/timepicker/timepicker1.html

## Requirements

AngularJS, Bootstrap

## Installation

### NPM
npm install --production

### Manual
Just copy `timepicker.js` and include it in your AngularJS project

## Testing

- Unit tests require Karma, Jasmine, Angular-mocks, and Chrome or PhantomJS
- End-to-end tests are included. These require Protractor, WebDriver, Selenium, mocha, chai,...

npm install
npm test

On Windows - modify the `"test"` script in <b>package.json</b> or run the tests by hand
To skip end-to-end testing remove the `"postinstall"` script in <b>package.json</b> and remove the protractor test.
