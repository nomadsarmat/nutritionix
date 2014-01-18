(function() {
  var router;

  router = function($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    });
    $routeProvider.when('/search', {
      templateUrl: 'partials/search.html',
      controller: 'SearchCtrl'
    });
    $routeProvider.when('/account', {
      authRequired: true,
      templateUrl: 'partials/account.html',
      controller: 'AccountCtrl'
    });
    $routeProvider.when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    });
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  };

  angular.module('ntx.routes', ['ngRoute']).config(['$routeProvider', router]);

}).call(this);
