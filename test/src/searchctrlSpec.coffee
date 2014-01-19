describe "Search Control Tests", ->
    module 'ntx.Search'

    beforeEach inject ($rootScope, $controller) ->
        @$scope = $rootScope.$new()
        @searchCtrl = $controller 'SearchCtrl', {@$scope}

    it "Creates a Search Controller", ->
        expect(@$scope.addFood).toEqual jasmine.any Function


