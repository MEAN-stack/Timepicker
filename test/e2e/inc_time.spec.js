var expect = require('chai').expect

describe('datepicker', function() {
  it('initialises the date to today', function() {
  
    var today = new Date()
    var dayVal = "" + today.getDate()
    
    browser.get('http://mean-stack.github.io/datepicker/datepicker9.html')
    
    var days = element.all(by.model('date.day'))
    days.count().then(function(count){
      expect(count).to.equal(4)
    })
    for (var i=0; i<4; i++) {
      days.get(i).getAttribute('value').then(function(value) {
        expect(value).to.equal(dayVal)
      })
    }
  })
  
  it('increments the date', function() {
  
    var now = new Date().getTime()
    var tomorrow = new Date(now+24*60*60*1000)
    var dayVal = "" + tomorrow.getDate()
    
    browser.get('http://mean-stack.github.io/datepicker/datepicker9.html')
    element(by.css('#incDate')).click()
    
    var days = element.all(by.model('date.day'))
    for (var i=0; i<4; i++) {
      days.get(i).getAttribute('value').then(function(value) {
        expect(value).to.equal(dayVal)
      })
    }
  })
  
  it('selects a quick date', function() {
  
    var epoch = new Date(0)
    var dayVal = "" + epoch.getDate() // '1' obviously!
    
    browser.get('http://mean-stack.github.io/datepicker/datepicker9.html')
    element.all(by.cssContainingText('option', 'epoch')).first().click();
    
    var days = element.all(by.model('date.day'))
    for (var i=0; i<4; i++) {
      days.get(i).getAttribute('value').then(function(value) {
        expect(value).to.equal(dayVal)
      })
    }
  })

  it('changes the day', function() {
  
    browser.get('http://mean-stack.github.io/datepicker/datepicker9.html')
    var el = element.all(by.model('date.day')).first()
    var ctrlA = protractor.Key.chord(protractor.Key.CONTROL, "a");
    el.sendKeys(ctrlA).sendKeys('23')
    
    var days = element.all(by.model('date.day'))
    for (var i=0; i<4; i++) {
      days.get(i).getAttribute('value').then(function(value) {
        expect(value).to.equal('23')
      })
    }
  })

})