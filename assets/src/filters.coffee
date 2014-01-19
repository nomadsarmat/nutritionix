interpolateFilter = (version) ->
    return (text) ->
        return String(text).replace /\%VERSION\%/mg, version

reverseFilter = ->
    toArray = (list) ->
        k = []
        out = []
        if list?
            if angular.isArray list
                out = list
            else if angular.isObject list
                out = (key for key of list)
        return out

    return (items) ->
        return toArray(items).slice().reverse()


angular.module('ntx.filters', [])
   .filter('interpolate', ['version', interpolateFilter])
   .filter('reverse', reverseFilter)
