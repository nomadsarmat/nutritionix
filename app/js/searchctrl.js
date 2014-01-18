(function() {
  var SearchCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SearchCtrl = (function() {
    function SearchCtrl($scope, $http, syncData, appId, appKey, nutritionixBase) {
      var _this = this;
      this.$scope = $scope;
      this.$http = $http;
      this.appId = appId;
      this.appKey = appKey;
      this.nutritionixBase = nutritionixBase;
      this.getItemDetails = __bind(this.getItemDetails, this);
      this.addFood = __bind(this.addFood, this);
      this.clearActive = __bind(this.clearActive, this);
      this.searchForData = __bind(this.searchForData, this);
      syncData(['macroCount']).$bind(this.$scope, 'macroCount').then(function() {
        if (_this.$scope.macroCount !== '') {
          return;
        }
        _this.$scope.macroCount = {
          calories: 0,
          fat: 0,
          carbs: 0,
          protein: 0
        };
      });
      this.$scope.searchName = null;
      this.currentFood = syncData('myfood', 10);
      this.getInstance();
      return;
    }

    SearchCtrl.prototype.getInstance = function() {
      this.$scope.addFood = this.addFood;
      this.$scope.getItemDetails = this.getItemDetails;
      this.$scope.searchForData = this.searchForData;
    };

    SearchCtrl.prototype.searchForData = function() {
      var params, url,
        _this = this;
      if (this.$scope.searchName == null) {
        return;
      }
      url = "" + this.nutritionixBase + "search/" + this.$scope.searchName;
      params = {
        appKey: this.appKey,
        appId: this.appId,
        fields: "item_name,brand_name,item_id,brand_id",
        results: "0:20"
      };
      this.$http.get(url, {
        params: params
      }).success(function(data) {
        var hit, _i, _len, _ref;
        _this.$scope.searchResult = data;
        _this.$scope.hits = data.hits;
        _ref = data.hits;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hit = _ref[_i];
          hit.active = false;
        }
      });
    };

    SearchCtrl.prototype.clearActive = function() {
      var hit, _i, _len, _ref;
      _ref = this.$scope.hits;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hit = _ref[_i];
        hit.active = false;
      }
    };

    SearchCtrl.prototype.addFood = function() {
      this.$scope.macroCount.calories += this.$scope.item.nutrition.calories;
      this.$scope.macroCount.protein += this.$scope.item.nutrition.protein;
      this.$scope.macroCount.carbs += this.$scope.item.nutrition.carbs;
      this.$scope.macroCount.fat += this.$scope.item.nutrition.fat;
      this.currentFood.$add({
        object: this.$scope.item
      });
      this.$scope.item = null;
      this.clearActive();
    };

    SearchCtrl.prototype.getItemDetails = function(item) {
      var id, params, url,
        _this = this;
      id = item._id;
      this.clearActive();
      item.active = true;
      url = "" + this.nutritionixBase + "item/";
      params = {
        appKey: this.appKey,
        appId: this.appId,
        id: id
      };
      this.$http.get(url, {
        params: params
      }).success(function(data) {
        _this.$scope.item = {
          name: data.item_name,
          brand: data.brand_name,
          id: data.item_id,
          nutrition: {
            calories: data.nf_calories,
            fat: data.nf_total_fat,
            carbs: data.nf_total_carbohydrate,
            protein: data.nf_protein
          }
        };
      });
    };

    return SearchCtrl;

  })();

  angular.module('ntx.Search', ['ntx.service.firebase', 'ntx.config']).controller('SearchCtrl', ['$scope', '$http', 'syncData', 'appId', 'appKey', 'nutritionixBase', SearchCtrl]);

}).call(this);
