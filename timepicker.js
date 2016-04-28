angular.module("timepickerTemplate", [])
.run(["$templateCache", function($templateCache) {
  // Cache each of the optional elements required by the directive
  $templateCache.put('hourTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.hour" class="form-control timepicker" type="text" size="2" maxlength="2">')
  $templateCache.put('minuteTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.minute" class="form-control timepicker" name="text" size="2" maxlength="2">')
  $templateCache.put('secondTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.second" class="form-control timepicker" type="text" size="2" maxlength="2">')
  $templateCache.put('amPmTemplate', '<button type="button" class="btn btn-default text-center form-control timepicker" ng-click="toggleAmPm()">{{date.amPm}}</button>')
}])
angular.module("timepicker", ["timepickerTemplate"])
.directive("myTimepicker", function($templateCache) {
  return {
    scope: {
      dt: "=value",
      dtMin: "=minTime",
      dtMax: "=maxTime"
    },
    link: function(scope, element, attrs) {
    
      // validate the time of day
      // The full date object tested against the min and max.
      // This allows the timepicker to be combined with a datepicker
      // directive, sharing the same value and min/max attributes
      var isValid = function(date) {

        if (scope.dtMin) {
          if (date.getTime() < scope.dtMin.getTime()) {
            return false
          }
        }
        if (scope.dtMax) {
          if (date.getTime() > scope.dtMax.getTime()) {
            return false
          }
        }
        return true
      }

      // set the default format
      var timeFormat = 'HHmm'
      if (attrs['format']) {
        timeFormat = attrs['format']
      }
      // 'hh' means 12-hour clock
      // 'HH' means 24-hour
      var showAmPm = /hh/.test(timeFormat)
      
      // 24-hour to 12-hour conversion is a bit wierd.
      // the simplest way is to use a lookup table      
      var getHours = function(date) {
        var hours = date.getHours()
        // 00.00 -> 12.00 AM
        // 01.00 -> 01.00 AM
        // 12.00 -> 12.00 PM
        // 13.00 -> 01.00 PM
        // etc
        var lookup = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11]
        if (showAmPm) {
          return lookup[hours]
        }
        else {
          return hours
        }
      }

      // return 'AM' or 'PM' as appropriate
      var getAmPm = function(date) {
        if (date.getHours() >= 12) {
          return 'PM'
        }
        else {
          return 'AM'
        }
      }

      scope.date = {
        hour: getHours(scope.dt),
        minute: scope.dt.getMinutes(),
        second: scope.dt.getSeconds(),
        amPm: getAmPm(scope.dt)
      }

      // The user clicked the AM/PM button in 12-hour mode
      // Check that the result is valid. If so then toggle the
      // button text and add or subtract 12 hours to the scope's date
      scope.toggleAmPm = function() {
        var d = new Date()
        if (scope.date.amPm==='AM') {
          d.setHours(scope.dt.getHours()+12)
          if (isValid(d)) {
            scope.date.amPm = 'PM'
            scope.dt.setHours(scope.dt.getHours()+12)
          }
        }
        else {
          d.setHours(scope.dt.getHours()-12)
          if (isValid(d)) {
            scope.date.amPm = 'AM'
            scope.dt.setHours(scope.dt.getHours()-12)
          }
        }
      }

      // update the bound values, so that the timepickers elements will show the correct date
      var updateElements = function(dateVal) {
        scope.date.hour = getHours(dateVal)
        scope.date.minute = dateVal.getMinutes()
        scope.date.second = dateVal.getSeconds()
        scope.date.amPm = getAmPm(dateVal)
      }

      //watchers
      scope.$watch('date.hour', function(newValue, oldValue) {
        var v = newValue * 1
        var d = new Date(scope.dt.getTime())
        
        if (showAmPm) {
          // validate 12-hour clock value
          // first we need to convert the value to 24-hour clock
          if (v>=1 && v<=12) {
            if (scope.date.amPm === 'AM') {
              if (v === 12) {
                d.setHours(0)
              }
              else {
                d.setHours(v)
              }
            }
            else {
              if (v === 12) {
                d.setHours(12)
              }
              else {
                d.setHours(v+12)
              }
            }
            // if the value is valid then update the date in the scope 
            if (isValid(d)) {
              scope.dt.setHours(d.getHours())
            }
          }
        }
        else {
          // validate hours value in 24-hour clock mode
          if (v>=0 && v<=24) {
            d.setHours(newValue)
            // if the value is valid then update the date in the scope
            if (isValid(d)) {
              scope.dt.setHours(newValue)
            }
          }
        }
        // make sure that the HTML elements are all showing correct values
        updateElements(scope.dt)
      });

      scope.$watch('date.minute', function(newValue, oldValue) {
        // validate minutes value
        var v = newValue * 1
        if (v>=0 && v<=60) {
          var d = new Date(scope.dt.getTime())
          d.setMinutes(newValue)
          // if the value is valid then update the date in the scope
          if (isValid(d)) {
            scope.dt.setMinutes(newValue)
          }
        }
        // make sure that the HTML elements are all showing correct values
        updateElements(scope.dt)
      })

      scope.$watch('date.second', function(newValue, oldValue) {
        // validate seconds value
        var v = newValue * 1
        if (v>=0 && v<=60) {
          var d = new Date(scope.dt.getTime())
          d.setSeconds(newValue)
          // if the value is valid then update the date in the scope
          if (isValid(d)) {
            scope.dt.setSeconds(newValue)
          }
        }
        // make sure that the HTML elements are all showing correct values
        updateElements(scope.dt)
      })

      // this watcher gets called if the date value is changed in the controller's scope
      scope.$watch('dt', function(newValue, oldValue) {
        // if the value is invalid then return the date to its previous value
        if (!isValid(newValue)) {
          scope.dt.setTime(oldValue.getTime())
        }
        // make sure that the HTML elements are all showing correct values
        updateElements(scope.dt)
      }, true) // 'true' here means watch date by value rather than reference
    },
    template: function(elem, attrs) {
      // parse the timeFormat string to produce the template
      // 'hh' means 12-hour clock
      // 'HH' means 24-hour
      // 'mm' means minutes
      // 'ss' means seconds
      var timeFormat = 'hhmm'
      if (attrs['format']) {
        timeFormat = attrs['format']
      }
      // CSS class is always required
      var template = "<style>.timepicker {border-radius:0; width: auto; display: inline-block;}</style>"
      var showAmPm = /hh/.test(timeFormat)
            
      // parse the timeFormat string to produce the template
      var arr = timeFormat.split('')
      var i = 0
      var cur = ''
      var next = ''
            
      while (i<arr.length) {
        cur = arr[i]
        if (i<arr.length-1) {
          next = arr[i+1]
        }
        else {
          next = ''
        }
        switch (cur) {
        case 'h':
          if (next == 'h') {
            i++
            while (arr[i+1]=='h') {
              i++
            }
            template += $templateCache.get('hourTemplate').trim()
          }
          else {
            template += 'h'
          }
          break;

        case 'H':
          if (next == 'H') {
            i++
            while (arr[i+1]=='H') {
              i++
            }
            template += $templateCache.get('hourTemplate').trim()
          }
          else {
            template += 'H'
          }
          break;

        case 'm':
          if (next == 'm') {
            i++
            while (arr[i+1]=='m') {
              i++
            }
            template += $templateCache.get('minuteTemplate').trim()
          }
          else {
            template += 'm'
          }
          break;
 
        case 's':
          if (next == 's') {
            i++
            while (arr[i+1]=='s') {
              i++
            }
            template += $templateCache.get('secondTemplate').trim()
          }
          else {
            template += 's'
          }
          break;

        default:
          template += arr[i]
          break;
        }
        i++
      }
      if (showAmPm) {
        // if format string specifies 12-hour clock then include AM/PM button
        template += $templateCache.get('amPmTemplate').trim()
      }
      return template
    }
  }
})

