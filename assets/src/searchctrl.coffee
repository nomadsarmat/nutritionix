class SearchCtrl
    constructor: (@$scope, syncData, @nutritionix) ->

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

        @nutritionix.searchForTerm(@$scope.searchName)
            .success (data) =>
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
        @clearActive()
        item.active = true
        @nutritionix.getItem(item._id).success (data) =>
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

module = angular.module 'ntx.Search', [
    'ntx.service.firebase'
    'ntx.config'
    'ntx.NutritionixAPI'
]

module.controller('SearchCtrl', [
        '$scope'
        'syncData'
        'nutritionixAPI'
        SearchCtrl
    ])
