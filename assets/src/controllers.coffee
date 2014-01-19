class NavCtrl
    constructor: (@$scope, @$location) ->
        @$scope.locations = [
            {
                name:'Home'
                title:'home'
                active:false
                path:"#/home"
                auth:"login,logout,error"
            }
            {
                name:'Search'
                title:'search'
                active:false
                path:"#/search"
                auth:"login,logout,error"
            }
            {
                name:'Login'
                title:'login'
                active:false
                path:"#/login"
                auth:"logout,error"
            }
            {
                name:'Account'
                title:'account'
                active:false
                path:"#/account"
                auth:"login"
            }
        ]

        @$scope.settings ?= pageTitle: ''

        @deactivateLocs()

        for location in @$scope.locations
            if @$location.path().indexOf(location.title) isnt -1
                @$scope.settings.pageTitle = location.name
                location.active = true
                break

        @getInstance()

    getInstance: =>
        @$scope.nav = @setNav
        return

    deactivateLocs: =>
        location.active = false for location in @$scope.locations
        return

    setNav: (location) =>
        @deactivateLocs()
        @$scope.settings.pageTitle = location.name
        location.active = true

        return

class HomeCtrl
    constructor: (@$scope, @syncData) ->
        #@syncData('syncedValue').$bind(@$scope, 'syncedValue')

        return

class MacroLabelCtrl
    constructor: (@$scope, @syncData, @$firebase, @firebaseRef) ->
        ref = @firebaseRef 'macroCount'
        macroCountsRef = @$firebase ref
        macroCountsRef.$bind @$scope, 'counts'

        return

class LoginCtrl
    constructor: (@$scope, @loginService, @$location) ->
        @$scope.email = null
        @$scope.pass = null
        @$scope.confirm = null
        @$scope.createMode = false

        @getInstance()

    getInstance: ->
        @$scope.login = @login
        @$scope.createAccount = @createAccount

        return

    login: (cb) =>
        @$scope.err = null
        unless @$scope.email?
            @$scope.err = 'Please enter an email address'
            return

        unless @$scope.pass?
            @$scope.err = 'Please enter a password'
            return

        @loginService.login @$scope.email, @$scope.pass, (err, user) =>
            @$scope.err = if err? then err else null

            cb?(user) unless err?

            return

        return

    createAccount: =>
        @$scope.err = null
        if @assertValidLoginAttempt()
            email = @$scope.email
            pass = @$scope.pass
            @loginService.createAccount email, pass, (err, user) ->
                if err?
                    @$scope.err = if err? then "#{err}" else null
                else
                    # must be logged in before I can write to my profile
                    @$scope.login ->
                        @loginService.createProfile user.uid, user.email
                        @$location.path '/account'
                        return
                return

    assertValidLoginAttempt: ->
        if not @$scope.email?
            @$scope.err = 'Please enter an email address'
        else if not @$scope.pass?
            @$scope.err = 'Please enter a password'
        else if @$scope.pass isnt @$scope.confirm
            @$scope.err = 'Passwords do not match'

        return not @$scope.err

class AccountCtrl
    constructor: (@$scope, @loginService, syncData, $location) ->
      syncData(['users', @$scope.auth.user.uid]).$bind @$scope, 'user'

      @$scope.oldpass = null
      @$scope.newpass = null
      @$scope.confirm = null
      @getInstance()

      return


    getInstance: ->
        @$scope.updatePassword = @updatePassword
        @$scope.logout         = @logout
        @$scope.reset          = @reset

        return

    updatePassword: =>
        @$scope.reset()
        @loginService.changePassword @buildPwdParms()

        return

    reset: =>
        @$scope.err = null
        @$scope.msg = null

        return


    logout: =>
        @loginService.logout()
        return

    buildPwdParms: =>
        params =
            email: @$scope.auth.user.email
            oldpass: @$scope.oldpass
            newpass: @$scope.newpass
            confirm: @$scope.confirm
            callback: (err) =>
                if err?
                    @$scope.err = err
                else
                    @$scope.oldpass = null
                    @$scope.newpass = null
                    @$scope.confirm = null
                    @$scope.msg = 'Password updated!'
                return

        return params

angular.module('ntx.controllers', ['ntx.Search'])
    .controller('NavCtrl', ['$scope', '$location', NavCtrl])
    .controller('HomeCtrl', ['$scope', 'syncData', HomeCtrl])
    .controller('MacroLabelCtrl', [
        '$scope'
        'syncData'
        '$firebase'
        'firebaseRef'
        MacroLabelCtrl
    ])
    .controller('LoginCtrl', ['$scope', 'loginService', '$location', LoginCtrl])
    .controller('AccountCtrl', [
        '$scope'
        'loginService'
        'syncData'
        '$location'
        AccountCtrl
    ])
