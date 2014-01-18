(function() {
  var interpolateFilter, reverseFilter;

  interpolateFilter = function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  };

  reverseFilter = function() {
    var toArray;
    toArray = function(list) {
      var k, key, out;
      k = [];
      out = [];
      if (list != null) {
        if (angular.isArray(list)) {
          out = list;
        } else if (angular.isObject(list)) {
          out = (function() {
            var _results;
            _results = [];
            for (key in list) {
              _results.push(key);
            }
            return _results;
          })();
        }
      }
      return out;
    };
    return function(items) {
      return toArray(items).slice().reverse();
    };
  };

  angular.module('ntx.filters', []).filter('interpolate', ['version', interpolateFilter]).filter('reverse', reverseFilter);

}).call(this);
