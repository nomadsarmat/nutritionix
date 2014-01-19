(function() {
  describe("Search Control Tests", function() {
    module('ntx.Search');
    beforeEach(inject(function($rootScope, $controller) {
      this.$scope = $rootScope.$new();
      return this.searchCtrl = $controller('SearchCtrl', {
        $scope: this.$scope
      });
    }));
    return it("Creates a Search Controller", function() {
      return expect(this.$scope.addFood).toEqual(jasmine.any(Function));
    });
  });

}).call(this);

/*
//# sourceMappingURL=../../test/unit/searchctrlSpec.js.map
*/