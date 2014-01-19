class SearchCtrl
    constructor: (@$scope, syncData, @nutritionix) ->
        syncData(['macroCount'])
            .$bind(@$scope, 'macroCount').then =>
                return unless @$scope.macroCount is ''
                @resetMacros()
                return

        @$scope.searchName = null

        @currentFood = syncData 'myfood', 10

        @getInstance()

        return

    resetMacros: =>
        @$scope.macroCount =
            calories : 0
            fat      : 0
            carbs    : 0
            protein  : 0
        return

    getInstance: ->
        @$scope.addFood        = @addFood
        @$scope.getItemDetails = @getItemDetails
        @$scope.searchForData  = @searchForData
        @$scope.resetMacros    = @resetMacros

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
        item = @$scope.item
        nutrition = item.nutrition
        @$scope.macroCount.calories += item.quantity * nutrition.calories
        @$scope.macroCount.protein  += item.quantity * nutrition.protein
        @$scope.macroCount.carbs    += item.quantity * nutrition.carbs
        @$scope.macroCount.fat      += item.quantity * nutrition.fat

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
                quantity: 1
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
