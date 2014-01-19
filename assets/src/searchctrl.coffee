class SearchCtrl
    constructor: (@$scope, @$http, syncData, @appId, @appKey,
        @nutritionixBase) ->

        syncData(['macroCount'])
            .$bind(@$scope, 'macroCount').then =>
                return unless @$scope.macroCount is ''
                @$scope.macroCount =
                    calories : 0
                    fat      : 0
                    carbs    : 0
                    protein  : 0
                return

        @$scope.searchName = null

        @currentFood = syncData 'myfood', 10

        @getInstance()

        return

    getInstance: ->
        @$scope.addFood = @addFood
        @$scope.getItemDetails = @getItemDetails
        @$scope.searchForData = @searchForData

        return

    searchForData: =>
        return unless @$scope.searchName?

        url = "#{@nutritionixBase}search/#{@$scope.searchName}"
        params = {
            @appKey
            @appId
            fields:"item_name,brand_name,item_id,brand_id"
            results:"0:20"
        }

        @$http.get(url, {params}).success (data) =>
            @$scope.searchResult = data
            @$scope.hits = data.hits
            for hit in data.hits
                hit.active = false
            return
        return

    clearActive: =>
        hit.active = false for hit in @$scope.hits

        return

    addFood: =>
        @$scope.macroCount.calories += @$scope.item.nutrition.calories
        @$scope.macroCount.protein  += @$scope.item.nutrition.protein
        @$scope.macroCount.carbs    += @$scope.item.nutrition.carbs
        @$scope.macroCount.fat      += @$scope.item.nutrition.fat

        @currentFood.$add object: @$scope.item

        @$scope.item = null

        @clearActive()

        return

    getItemDetails: (item) =>
        id = item._id
        @clearActive()
        item.active = true
        url = "#{@nutritionixBase}item/"

        params = {
            @appKey
            @appId
            id
        }

        @$http.get(url, {params}).success (data) =>
            @$scope.item =
                name: data.item_name
                brand: data.brand_name
                id: data.item_id
                nutrition:
                    calories: data.nf_calories
                    fat: data.nf_total_fat
                    carbs: data.nf_total_carbohydrate
                    protein: data.nf_protein
            return

        return

angular.module('ntx.Search', ['ntx.service.firebase', 'ntx.config'])
    .controller('SearchCtrl', [
        '$scope'
        '$http'
        'syncData'
        'appId'
        'appKey'
        'nutritionixBase'
        SearchCtrl
    ])
