angular.module("timepickerTemplate", [])
.run(["$templateCache", function($templateCache) {
  $templateCache.put('hourTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.hour" class="form-control timepicker" type="text" size="2" maxlength="2">')
  $templateCache.put('minuteTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.minute" class="form-control timepicker" name="text" size="2" maxlength="2">')
  $templateCache.put('secondTemplate', '<input ng-model-options="{ updateOn: \'blur\' }" ng-model="date.second" class="form-control timepicker" type="text" size="2" maxlength="2">')
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

      var timeFormat = 'hhmm'
      if (attrs['format']) {
        timeFormat = attrs['format']
      }
      scope.settings = {
        showAmPm: false,
      }

      scope.date = {
        hour: scope.dt.getHours(),
        minute: scope.dt.getMinutes(),
        second: scope.dt.getSeconds(),
      }

      var updateElements = function(dateVal) {
        scope.date.hour = dateVal.getHours()
        scope.date.minute = scope.dt.getMinutes()
        scope.date.second = scope.dt.getSeconds()
      }

      //watchers
      scope.$watch('date.hour', function(newValue, oldValue) {
        var v = newValue * 1
        if (v>=0 && v<=24) {
          var d = new Date(scope.dt.getTime())
          d.setHours(newValue)
          if (isValid(d)) {
            scope.dt.setHours(newValue)
          }
        }
        updateElements(scope.dt)
      });

      scope.$watch('date.minute', function(newValue, oldValue) {
        var v = newValue * 1
        if (v>=0 && v<=60) {
          var d = new Date(scope.dt.getTime())
          d.setMinutes(newValue)
          if (isValid(d)) {
            scope.dt.setMinutes(newValue)
          }
        }
        updateElements(scope.dt)
      })

      scope.$watch('date.second', function(newValue, oldValue) {
        var v = newValue * 1
        if (v>=0 && v<=60) {
          var d = new Date(scope.dt.getTime())
          d.setSeconds(newValue)
          if (isValid(d)) {
            scope.dt.setSeconds(newValue)
          }
        }
        updateElements(scope.dt)
      })
			
      scope.$watch('dt', function(newValue, oldValue) {
        if (!isValid(newValue)) {
          scope.dt.setTime(oldValue.getTime())
        }
        updateElements(newValue)
      }, true) // 'true' here means watch date by value rather than reference
    },
    template: function(elem, attrs) {
      var timeFormat = 'hhmm'
      if (attrs['format']) {
        timeFormat = attrs['format']
      }
      var template = "<style>.timepicker {border-radius:0; width: auto; display: inline-block;}</style>"
      var showHour = /hh/.test(timeFormat)
      var showMinute = /mm/.test(timeFormat)
      var showSecond = /ss/.test(timeFormat)
            
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
      return template
    }
  }
})
