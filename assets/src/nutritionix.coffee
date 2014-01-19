# Nutritionix API for searches/details
class NutritionixAPI
    # The base API Url
    BASE_URL = "https://api.nutritionix.com/v1_1/"
    constructor: (@$http, @appId, @appKey) ->

    # Search the database
    # @param [String] name The name of the item you're searching for
    # @param [Object] options Search Options
    # @option options [String] results Results bounds ex: "0:20"
    # @return [Promise] a promise for the request
    searchForTerm: (name, options={}) =>
        url = "#{BASE_URL}search/#{name}"
        defaults = {
            @appKey
            @appId
            fields:"item_name,brand_name,item_id,brand_id"
            results:"0:20"
        }
        params = _.defaults options, defaults

        return @$http.get(url, {params})

    # Gets the details for a particular item by ID
    # @param [String] id The id of the item to get
    # @return [Promise] a promise for the request
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

