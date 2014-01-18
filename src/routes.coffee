router = ($routeProvider) ->
    $routeProvider.when '/home',
        templateUrl: 'partials/home.html'
        controller: 'HomeCtrl'

    $routeProvider.when '/search',
        templateUrl: 'partials/search.html'
        controller: 'SearchCtrl'

    $routeProvider.when '/account',
        authRequired: true, # must authenticate before viewing this page
        templateUrl: 'partials/account.html',
        controller: 'AccountCtrl'

    $routeProvider.when '/login',
        templateUrl: 'partials/login.html'
        controller: 'LoginCtrl'

    $routeProvider.otherwise redirectTo: '/home'

    return

angular.module('ntx.routes', ['ngRoute'])
   # configure views; the authRequired parameter is used for specifying pages
   # which should only be available while logged in
   .config ['$routeProvider', router]
