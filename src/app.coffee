# Declare app level module which depends on filters, and services
app = angular.module 'ntx', [
    'ntx.config'
    'ntx.routes'
    'ntx.filters'
    'ntx.services'
    'ntx.directives'
    'ntx.controllers'
    'waitForAuth'
    'routeSecurity'
]

firebaseStartup = (loginService, $rootScope, FBURL) ->
    if FBURL is 'https://INSTANCE.firebaseio.com'
        # double-check that the app has been configured
        angular
            .element(document.body)
            .html '<h1>Please configure app/js/config.js before running!</h1>'
        setTimeout (-> angular.element(document.body).removeClass('hide')), 250
    else
        # establish authentication
        $rootScope.auth = loginService.init '/login'
        $rootScope.FBURL = FBURL

    return

app.run ['loginService', '$rootScope', 'FBURL', firebaseStartup]
