(function() {
  describe("Search Control Tests", function() {
    beforeEach(module('ntx.Search'));
    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
      this.$httpBackend = $httpBackend;
      this.nutritionixAPI = jasmine.createSpyObj('nutritionix', ['searchForTerm']);
      this.nutritionixAPI.searchForTerm.andReturn(jasmine.createSpyObj('promise', ['success']));
      this.$scope = $rootScope.$new();
      return this.searchCtrl = $controller('SearchCtrl', {
        $scope: this.$scope,
        nutritionixAPI: this.nutritionixAPI
      });
    }));
    it("Resets macros to 0", function() {
      var expected;
      expected = {
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      };
      this.$scope.macroCount = {
        calories: 10,
        fat: 20,
        carbs: 30,
        protein: 40
      };
      this.$scope.resetMacros();
      return expect(this.$scope.macroCount).toEqual(expected);
    });
    it("Searches for Data", function() {
      this.$scope.searchName = 'taco';
      this.$scope.searchForData();
      return expect(this.nutritionixAPI.searchForTerm).toHaveBeenCalledWith('taco');
    });
    it("Doesn't search when there's no term", function() {
      this.$scope.searchName = null;
      this.$scope.searchForData();
      return expect(this.nutritionixAPI.searchForTerm).not.toHaveBeenCalled();
    });
    it("Doesn't search when there's an empty term", function() {
      this.$scope.searchName = '';
      this.$scope.searchForData();
      return expect(this.nutritionixAPI.searchForTerm).not.toHaveBeenCalled();
    });
    return it("Sets hits as not active", function() {
      var expected;
      expected = [
        {
          active: false
        }, {
          active: false
        }, {
          active: false
        }
      ];
      this.$scope.hits = [
        {
          active: true
        }, {
          active: false
        }, {
          active: true
        }
      ];
      this.searchCtrl.clearActive();
      return expect(this.$scope.hits).toEqual(expected);
    });
  });

}).call(this);

/*
//# sourceMappingURL=../../test/unit/searchctrlSpec.js.map
*/