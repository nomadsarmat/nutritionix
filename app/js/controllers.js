(function() {
  var AccountCtrl, HomeCtrl, LoginCtrl, MacroLabelCtrl, NavCtrl, SearchCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NavCtrl = (function() {
    function NavCtrl($scope, $location) {
      var location, _base, _i, _len, _ref;
      this.$scope = $scope;
      this.$location = $location;
      this.setNav = __bind(this.setNav, this);
      this.deactivateLocs = __bind(this.deactivateLocs, this);
      this.getInstance = __bind(this.getInstance, this);
      this.$scope.locations = [
        {
          name: 'Home',
          title: 'home',
          active: false,
          path: "#/home",
          auth: "login,logout,error"
        }, {
          name: 'Search',
          title: 'search',
          active: false,
          path: "#/search",
          auth: "login,logout,error"
        }, {
          name: 'Login',
          title: 'login',
          active: false,
          path: "#/login",
          auth: "logout,error"
        }, {
          name: 'Account',
          title: 'account',
          active: false,
          path: "#/account",
          auth: "login"
        }
      ];
      if ((_base = this.$scope).settings == null) {
        _base.settings = {
          pageTitle: ''
        };
      }
      this.deactivateLocs();
      _ref = this.$scope.locations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        location = _ref[_i];
        if (this.$location.path().indexOf(location.title) !== -1) {
          this.$scope.settings.pageTitle = location.name;
          location.active = true;
          break;
        }
      }
      this.getInstance();
    }

    NavCtrl.prototype.getInstance = function() {
      this.$scope.nav = this.setNav;
    };

    NavCtrl.prototype.deactivateLocs = function() {
      var location, _i, _len, _ref;
      _ref = this.$scope.locations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        location = _ref[_i];
        location.active = false;
      }
    };

    NavCtrl.prototype.setNav = function(location) {
      this.deactivateLocs();
      this.$scope.settings.pageTitle = location.name;
      location.active = true;
    };

    return NavCtrl;

  })();

  HomeCtrl = (function() {
    function HomeCtrl($scope, syncData) {
      this.$scope = $scope;
      this.syncData = syncData;
      this.syncData('syncedValue').$bind(this.$scope, 'syncedValue');
      return;
    }

    return HomeCtrl;

  })();

  MacroLabelCtrl = (function() {
    function MacroLabelCtrl($scope, syncData, $firebase, firebaseRef) {
      var macroCountsRef, ref;
      this.$scope = $scope;
      this.syncData = syncData;
      this.$firebase = $firebase;
      this.firebaseRef = firebaseRef;
      ref = this.firebaseRef('macroCount');
      macroCountsRef = this.$firebase(ref);
      macroCountsRef.$bind(this.$scope, 'counts');
      return;
    }

    return MacroLabelCtrl;

  })();

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
        results: "0:5"
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

  LoginCtrl = (function() {
    function LoginCtrl($scope, loginService, $location) {
      this.$scope = $scope;
      this.loginService = loginService;
      this.$location = $location;
      this.createAccount = __bind(this.createAccount, this);
      this.login = __bind(this.login, this);
      this.$scope.email = null;
      this.$scope.pass = null;
      this.$scope.confirm = null;
      this.$scope.createMode = false;
      this.getInstance();
    }

    LoginCtrl.prototype.getInstance = function() {
      this.$scope.login = this.login;
      this.$scope.createAccount = this.createAccount;
    };

    LoginCtrl.prototype.login = function(cb) {
      var _this = this;
      this.$scope.err = null;
      if (this.$scope.email == null) {
        this.$scope.err = 'Please enter an email address';
        return;
      }
      if (this.$scope.pass == null) {
        this.$scope.err = 'Please enter a password';
        return;
      }
      this.loginService.login(this.$scope.email, this.$scope.pass, function(err, user) {
        _this.$scope.err = err != null ? err : null;
        if (err == null) {
          if (typeof cb === "function") {
            cb(user);
          }
        }
      });
    };

    LoginCtrl.prototype.createAccount = function() {
      var email, pass;
      this.$scope.err = null;
      if (this.assertValidLoginAttempt()) {
        email = this.$scope.email;
        pass = this.$scope.pass;
        return this.loginService.createAccount(email, pass, function(err, user) {
          if (err != null) {
            this.$scope.err = err != null ? "" + err : null;
          } else {
            this.$scope.login(function() {
              this.loginService.createProfile(user.uid, user.email);
              this.$location.path('/account');
            });
          }
        });
      }
    };

    LoginCtrl.prototype.assertValidLoginAttempt = function() {
      if (this.$scope.email == null) {
        this.$scope.err = 'Please enter an email address';
      } else if (this.$scope.pass == null) {
        this.$scope.err = 'Please enter a password';
      } else if (this.$scope.pass !== this.$scope.confirm) {
        this.$scope.err = 'Passwords do not match';
      }
      return !this.$scope.err;
    };

    return LoginCtrl;

  })();

  AccountCtrl = (function() {
    function AccountCtrl($scope, loginService, syncData, $location) {
      this.$scope = $scope;
      this.loginService = loginService;
      this.buildPwdParms = __bind(this.buildPwdParms, this);
      this.logout = __bind(this.logout, this);
      this.reset = __bind(this.reset, this);
      this.updatePassword = __bind(this.updatePassword, this);
      syncData(['users', this.$scope.auth.user.uid]).$bind(this.$scope, 'user');
      this.$scope.oldpass = null;
      this.$scope.newpass = null;
      this.$scope.confirm = null;
      this.getInstance();
      return;
    }

    AccountCtrl.prototype.getInstance = function() {
      this.$scope.updatePassword = this.updatePassword;
      this.$scope.logout = this.logout;
      this.$scope.reset = this.reset;
    };

    AccountCtrl.prototype.updatePassword = function() {
      this.$scope.reset();
      this.loginService.changePassword(this.buildPwdParms());
    };

    AccountCtrl.prototype.reset = function() {
      this.$scope.err = null;
      this.$scope.msg = null;
    };

    AccountCtrl.prototype.logout = function() {
      this.loginService.logout();
    };

    AccountCtrl.prototype.buildPwdParms = function() {
      var params,
        _this = this;
      params = {
        email: this.$scope.auth.user.email,
        oldpass: this.$scope.oldpass,
        newpass: this.$scope.newpass,
        confirm: this.$scope.confirm,
        callback: function(err) {
          if (err != null) {
            _this.$scope.err = err;
          } else {
            _this.$scope.oldpass = null;
            _this.$scope.newpass = null;
            _this.$scope.confirm = null;
            _this.$scope.msg = 'Password updated!';
          }
        }
      };
      return params;
    };

    return AccountCtrl;

  })();

  angular.module('myApp.controllers', []).controller('NavCtrl', ['$scope', '$location', NavCtrl]).controller('HomeCtrl', ['$scope', 'syncData', HomeCtrl]).controller('MacroLabelCtrl', ['$scope', 'syncData', '$firebase', 'firebaseRef', MacroLabelCtrl]).controller('SearchCtrl', ['$scope', '$http', 'syncData', 'appId', 'appKey', 'nutritionixBase', SearchCtrl]).controller('LoginCtrl', ['$scope', 'loginService', '$location', LoginCtrl]).controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', AccountCtrl]);

}).call(this);
