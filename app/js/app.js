(function() {
  var app, firebaseStartup;

  app = angular.module('ntx', ['ntx.config', 'ntx.routes', 'ntx.filters', 'ntx.controllers', 'ntx.service.login', 'ntx.service.firebase', 'waitForAuth', 'routeSecurity']);

  firebaseStartup = function(loginService, $rootScope, FBURL) {
    if (FBURL === 'https://INSTANCE.firebaseio.com') {
      angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
      setTimeout((function() {
        return angular.element(document.body).removeClass('hide');
      }), 250);
    } else {
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
    }
  };

  app.run(['loginService', '$rootScope', 'FBURL', firebaseStartup]);

}).call(this);
