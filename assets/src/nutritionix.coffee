class NutritionixAPI
    BASE_URL = "https://api.nutritionix.com/v1_1/"
    constructor: (@$http, @appId, @appKey) ->

    searchForTerm: (name) =>
        url = "#{BASE_URL}search/#{name}"
        params = {
            @appKey
            @appId
            fields:"item_name,brand_name,item_id,brand_id"
            results:"0:20"
        }

        return @$http.get(url, {params})

    getItem: (id) =>
        url = "#{BASE_URL}item/"

        params = {
            @appKey
            @appId
            id
        }

        return @$http.get(url, {params})

nutritionixSingleton = ($http, appId, appKey) ->
    ntxAPI = new NutritionixAPI $http, appId, appKey
    return ntxAPI

module = angular.module('ntx.NutritionixAPI', ['ntx.config'])
module.factory('nutritionixAPI', ['$http', 'appId', 'appKey', nutritionixSingleton])

