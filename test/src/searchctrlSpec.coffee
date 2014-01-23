describe "Search Control Tests", ->
    beforeEach module 'ntx.Search'

    beforeEach inject ($rootScope, $controller, @$httpBackend) ->
        @nutritionixAPI = jasmine.createSpyObj 'nutritionix', ['searchForTerm']
        @nutritionixAPI.searchForTerm
            .andReturn jasmine.createSpyObj 'promise', ['success']
        @$scope = $rootScope.$new()
        @searchCtrl = $controller 'SearchCtrl', {@$scope, @nutritionixAPI}

    it "Resets macros to 0", ->
        expected =
            calories : 0
            fat      : 0
            carbs    : 0
            protein  : 0
        @$scope.macroCount =
            calories : 10
            fat      : 20
            carbs    : 30
            protein  : 40

        @$scope.resetMacros()

        expect(@$scope.macroCount).toEqual expected

    it "Searches for Data", ->
        @$scope.searchName = 'taco'
        @$scope.searchForData()
        expect(@nutritionixAPI.searchForTerm).toHaveBeenCalledWith 'taco'

    it "Doesn't search when there's no term", ->
        @$scope.searchName = null
        @$scope.searchForData()
        expect(@nutritionixAPI.searchForTerm).not.toHaveBeenCalled()

    it "Doesn't search when there's an empty term", ->
        @$scope.searchName = ''
        @$scope.searchForData()
        expect(@nutritionixAPI.searchForTerm).not.toHaveBeenCalled()

    it "Sets hits as not active", ->
        expected = [
            {active : false}
            {active : false}
            {active : false}
        ]

        @$scope.hits = [
            {active : true}
            {active : false}
            {active : true}
        ]

        @searchCtrl.clearActive()
        expect(@$scope.hits).toEqual expected

    
