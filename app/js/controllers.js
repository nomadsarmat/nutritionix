'use strict';

/* Controllers */



angular.module('myApp.controllers', [])
    .controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.locations = [
            {name:'Home', title:'home', active:false, path:"#/home", auth:"login,logout,error"},
            {name:'Search', title:'search', active:false, path:"#/search", auth:"login,logout,error"},
            {name:'Login', title:'login', active:false, path:"#/login", auth:"logout,error"},
            {name:'Account', title:'account', active:false, path:"#/account", auth:"login"}
        ];
        if ($scope.settings == null) {
            $scope.settings = {pageTitle: ''};
        }
        var deactivateLocs = function() {
            for (var i=0; i<$scope.locations.length; i++) {
                $scope.locations[i].active = false;
            }
        }

        deactivateLocs();

        for (var i=0; i<$scope.locations.length; i++) {
            if ($location.path().indexOf($scope.locations[i].title) >= 0) {
                $scope.settings.pageTitle = $scope.locations[i].name;
                $scope.locations[i].active = true;
                break;
            }
        }
        $scope.nav = function(loc) {
            deactivateLocs();
            $scope.settings.pageTitle = loc.name;
            loc.active = true;
        }

    }])
    .controller('HomeCtrl', ['$scope', 'syncData', function($scope, syncData) {
        syncData('syncedValue').$bind($scope, 'syncedValue');
    }])
    .controller('MacroLabelCtrl', ['$scope', 'syncData', '$firebase', 'firebaseRef', function($scope, syncData, $firebase, firebaseRef) {
        var ref = firebaseRef('macroCount');
        var macroCountsRef = $firebase(ref);
        macroCountsRef.$bind($scope, 'counts');
    }])
    .controller('SearchCtrl', ['$scope', '$http', 'syncData', '$firebase', 'firebaseRef', 'appId', 'appKey', function($scope, $http, syncData, $firebase, firebaseRef, appId, appKey) {
        var ref = firebaseRef('macroCount');
        var macroCounts = $firebase(ref);
        macroCounts.$bind($scope, 'macroCount').then(function() {
            $scope.macroCount = {
                calories : 0,
                fat      : 0,
                carbs    : 0,
                protein  : 0
            };
        });

        $scope.searchName = null;
        var baseUrl = "https://api.nutritionix.com/v1_1/";

        var currentFood = syncData('myfood', 10);

        var clearActive = function() {
            for(var i=0;i<$scope.hits.length;i++){
                $scope.hits[i].active = false;
            }
        }
        $scope.addFood = function() {
            $scope.macroCount.calories += $scope.item.nutrition.calories;
            $scope.macroCount.protein  += $scope.item.nutrition.protein;
            $scope.macroCount.carbs    += $scope.item.nutrition.carbs;
            $scope.macroCount.fat      += $scope.item.nutrition.fat;
            currentFood.$add({object:$scope.item});
            $scope.item = null;
            clearActive();
        }

        $scope.getItemDetails = function(item) {
            var id = item._id;
            clearActive();
            item.active = true;
            item.active = true
            var url = baseUrl+"item/";
            var params = {
                appKey:appKey,
                appId:appId,
                id: id
            }
            $http.get(url, {params:params})
                .success(function(data) {
                    $scope.item = {
                        name: data.item_name,
                        brand: data.brand_name,
                        id: data.item_id,
                        nutrition: {
                            calories: data.nf_calories,
                            fat: data.nf_total_fat,
                            carbs: data.nf_total_carbohydrate,
                            protein: data.nf_protein
                        }
                    }
                });
        }

      // add new messages to the list
      $scope.searchForData = function() {
         if( $scope.searchName ) {
             var url = baseUrl+"search/"+$scope.searchName+"";
             var params = {
                appKey:appKey,
                appId:appId,
                fields:"item_name,brand_name,item_id,brand_id",
                results:"0:5"
            }

             $http.get(url, {params:params})
                .success(function(data){
                    $scope.searchResult = data;
                    $scope.hits = data.hits;
                    for(var i=0;i<data.hits.length;i++){
                        data.hits[i].active = false;
                    }
                });
         }
      };
   }])
   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
      syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

      $scope.logout = function() {
         loginService.logout();
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);
